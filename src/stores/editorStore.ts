import { action, computed, observable } from 'mobx';
import * as Turndown from 'turndown';
import { emptyArticle } from '../models/Article.model';
import articlesStore from './articlesStore';
// import articlesStore from './articlesStore';

export class EditorStore {
    @observable public title = '';
    @observable public description = '';
    @observable public body = '';
    @observable public inProgress = false;
    @observable public errors = undefined;
    @observable public tagList: string[] = [];
    private turndownService = new Turndown.default();

    @computed 
    get markdownBody(){
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
    public addTag(tag: string){
        if(!tag){
            return;
        }

        if(!this.tagList.some(element => element.toLocaleLowerCase() === tag.toLocaleLowerCase())){
            this.tagList.push(tag);
        }
    }

    @action
    public deleteTag(tag: string){
        this.tagList = this.tagList.filter(t => t !== tag);
    }

    @action
    public submit() {
        this.inProgress = true;
        this.errors = undefined;
        const article = Object.assign(emptyArticle(), {
            body: this.body,
            description: this.description,
            tagList: this.tagList,
            title: this.title
        });

        return articlesStore.createArticle(article)
        .finally(action(() => {
            this.inProgress = false;
        }))
    }
}

export default new EditorStore();