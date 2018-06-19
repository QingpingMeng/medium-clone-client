import { EditorState } from 'draft-js';
import { convertToRaw } from 'draft-js';
import { createEditorState } from 'medium-draft';
import mediumDraftExporter from 'medium-draft/lib/exporter';
import mediumDraftImporter from 'medium-draft/lib/importer';
import { action, computed, observable } from 'mobx';
import * as Turndown from 'turndown';
import { emptyArticle, IArticle } from '../models/Article.model';
import articlesStore from './articlesStore';
// import articlesStore from './articlesStore';

export class EditorStore {
    @observable public title = '';
    @observable public description = '';
    @observable public body = '';
    @observable public inProgress = false;
    @observable public errors = undefined;
    @observable public editorState = EditorState.createEmpty();
    @observable public tagList: string[] = [];
    @observable public articleSlug: string | undefined = undefined;
    private turndownService = new Turndown.default();

    @computed
    get markdownBody() {
        return this.turndownService.turndown(this.body);
    }

    @action
    public setTitle(title: string) {
        this.title = title;
    }

    @action
    public setDescription(description: string) {
        this.description = description;
    }

    @action
    public setBody(body: string) {
        this.body = body;
    }

    @action
    public setEditorState(editorState: EditorState){
        this.editorState = editorState;
    }

    @action
    public setArticleSlug(articleSlug: string | undefined) {
        if (this.articleSlug !== articleSlug) {
            this.reset();
            this.articleSlug = articleSlug;
        }
    }

    @action
    public loadInitialData() {
        if (!this.articleSlug) {
            return Promise.resolve();
        }

        this.inProgress = true;
        return articlesStore
            .loadArticle(this.articleSlug, { acceptCached: true })
            .then(
                action((article: IArticle) => {
                    if (!article) {
                        throw new Error(`Can't load original article`);
                    }

                    this.title = article.title;
                    this.description = article.description;
                    this.body = article.body;
                    this.editorState = createEditorState(convertToRaw(mediumDraftImporter(this.body)));
                    this.tagList = article.tagList;
                })
            )
            .finally(
                action(() => {
                    this.inProgress = false;
                })
            );
    }

    @action
    public reset() {
        this.title = '';
        this.description = '';
        this.body = '';
        this.tagList = [];
    }

    @action
    public addTag(tag: string) {
        if (!tag) {
            return;
        }

        if (
            !this.tagList.some(
                element =>
                    element.toLocaleLowerCase() === tag.toLocaleLowerCase()
            )
        ) {
            this.tagList.push(tag);
        }
    }

    @action
    public deleteTag(tag: string) {
        this.tagList = this.tagList.filter(t => t !== tag);
    }

    @action
    public submit() {
        this.inProgress = true;
        this.errors = undefined;
       
        const renderedHTML = mediumDraftExporter(this.editorState.getCurrentContent());
        const article = Object.assign(emptyArticle(), {
            body: renderedHTML,
            description: this.description,
            tagList: this.tagList,
            title: this.title
        });

        return articlesStore.createArticle(article).finally(
            action(() => {
                this.inProgress = false;
            })
        );
    }
}

export default new EditorStore();
