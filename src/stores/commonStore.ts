import { action, observable, reaction } from 'mobx';
// import agent from '../agent';

export class CommonStore {
    @observable public appName = 'Conduit';
    @observable public token = window.localStorage.getItem('jwt');
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

    @action public loadTags() {
        this.isLoadingTags = true;
        return;
    }

    @action public setToken(token: string) {
        this.token = token;
    }

    @action public setAppLoaded() {
        this.appLoaded = true;
    }
}

export default new CommonStore();
