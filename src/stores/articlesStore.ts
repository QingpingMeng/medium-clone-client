import { action, computed, observable } from 'mobx';
import agent from '../agent';
// import agent from '../agent';
import { IArticle } from '../models/Article.model';

const LIMIT = 10;

export interface IPredicate {
    myFeed?: boolean;
    favoritedBy?: string;
    tag?: string;
    author?: string;
}

export class ArticlesStore {
    @observable public isLoading = false;
    @observable public page = 0;
    @observable public totalPagesCount = 0;
    @observable public articlesRegistry = observable.map<string, IArticle>();
    @observable public predicate: IPredicate = {};

    @computed
    get articles() {
        return Array.from(this.articlesRegistry.values());
    }

    public clear() {
        this.articlesRegistry.clear();
        this.page = 0;
    }

    public getArticle(slug: string) {
        return this.articlesRegistry.get(slug);
    }

    @action
    public setPage(page: number) {
        this.page = page - 1;
    }

    @action
    public setPredicate(predicate: IPredicate) {
        if (JSON.stringify(predicate) === JSON.stringify(this.predicate)) {
            return;
        }

        this.clear();
        this.predicate = predicate;
    }

    @action
    public loadArticles() {
        this.isLoading = true;
        return this.$req()
            .then(
                action(({ articles, articlesCount }) => {
                    this.articlesRegistry.clear();
                    articles.forEach((article: IArticle) => {
                        this.articlesRegistry.set(article.slug, article);
                        this.totalPagesCount = Math.ceil(articlesCount / LIMIT);
                    });
                })
            )
            .finally(
                action(() => {
                    this.isLoading = false;
                })
            );
    }

    @action
    public $req() {
        if (this.predicate.myFeed) {
            return agent.Articles.feed(this.page, LIMIT);
        }

        if (this.predicate.favoritedBy) {
            return agent.Articles.favoritedBy(
                this.predicate.favoritedBy,
                this.page,
                LIMIT
            );
        }

        if (this.predicate.tag) {
            return agent.Articles.byTag(this.predicate.tag, this.page, LIMIT);
        }

        if (this.predicate.author) {
            return agent.Articles.byAuthor(
                this.predicate.author,
                this.page,
                LIMIT
            );
        }

        return agent.Articles.all(this.page, LIMIT);
    }

    @action
    public makeFavorite(slug: string) {
        const article = this.getArticle(slug);
        if (article && !article.favorited) {
            article.favorited = true;
            article.favCount++;
            return agent.Articles.favorite(slug).catch(
                action(err => {
                    article.favorited = false;
                    article.favCount--;
                    throw err;
                })
            );
        }
        return Promise.resolve();
    }

    @action
    public unmakeFavorite(slug: string) {
        const article = this.getArticle(slug);
        if (article && article.favorited) {
            article.favorited = false;
            article.favCount--;
            return agent.Articles.favorite(slug).catch(
                action(err => {
                    article.favorited = true;
                    article.favCount++;
                    throw err;
                })
            );
        }
        return Promise.resolve();
    }
}

export default new ArticlesStore();
