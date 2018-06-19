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
    @observable public isLoadingDetail = false;
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
    public getArticleAsync(slug: string) {
        this.isLoadingDetail = true;
        if (this.articlesRegistry.get(slug)) {
            this.isLoadingDetail = false;
            return Promise.resolve(this.articlesRegistry.get(slug));
        }
        this.isLoadingDetail = true;
        return this.loadArticles()
            .then(
                action(() => {
                    this.isLoadingDetail = false;
                    return this.articlesRegistry.get(slug);
                })
            )
            .finally(
                action(() => {
                    this.isLoadingDetail = false;
                })
            );
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
    public loadArticle(slug: string, { acceptCached = false } = {}) {
        if (acceptCached) {
            const article = this.getArticle(slug);
            if (article) {
                return Promise.resolve(article);
            }
        }

        this.isLoading = true;
        return agent.Articles.get(slug)
            .then(
                action(({ article }) => {
                    this.articlesRegistry.set(article.slug, article);
                    return article;
                })
            )
            .finally(action(() => (this.isLoading = false)));
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
            article.favoritesCount++;
            return agent.Articles.favorite(slug).catch(
                action(err => {
                    article.favorited = false;
                    article.favoritesCount--;
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
            article.favoritesCount--;
            return agent.Articles.unfavorite(slug).catch(
                action(err => {
                    article.favorited = true;
                    article.favoritesCount++;
                    throw err;
                })
            );
        }
        return Promise.resolve();
    }

    @action
    public deleteArticle(slug: string) {
        this.articlesRegistry.delete(slug);
        return agent.Articles.del(slug).catch(
            action(err => {
                this.loadArticles();
                throw err;
            })
        );
    }

    @action
    public createArticle(articleToCreate: IArticle) {
        return agent.Articles.create(articleToCreate).then(({ article }) => {
            this.articlesRegistry.set(article.slug, article);
            return article;
        });
    }
}

export default new ArticlesStore();
