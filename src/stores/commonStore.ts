import { action, observable, reaction } from 'mobx';
import agent from '../agent';
// import agent from '../agent';

export class CommonStore {
    @observable public appName = 'Conduit';
    @observable public appSlogan = 'A place to share your knowledge.';
    @observable public token = window.localStorage.getItem('jwt') || undefined;
    @observable public appLoaded = false;

    @observable public tags = [];
    @observable public isLoadingTags = false;

    constructor() {
        reaction(
            () => this.token,
            token => {
                if (token) {
                    window.localStorage.setItem('jwt', token);
                } else {
                    window.localStorage.removeItem('jwt');
                }
            }
        );
    }

    @action
    public loadTags() {
        this.isLoadingTags = true;
        return agent.Tags.getAll()
            .then(
                action(({ tags }) => {
                    this.tags = tags.map((t: string) => t.toLocaleLowerCase());
                })
            )
            .finally(
                action(() => {
                    this.isLoadingTags = false;
                })
            );
    }

    @action
    public setToken(token: string) {
        this.token = token;
    }

    @action
    public setAppLoaded() {
        this.appLoaded = true;
    }
}

export default new CommonStore();
