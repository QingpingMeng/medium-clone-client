import { action, observable } from 'mobx';
import agent from '../agent';
import commonStore from './commonStore';
import userStore from './userStore';

export class AuthStore {
    @observable public inProgress = false;
    @observable
    public errors: { [key: string]: string[] } | undefined = undefined;
    @observable
    public values = {
        email: '',
        password: '',
        username: ''
    };

    @action
    public setValue(key: string, value: string) {
        this.values[key] = value;
    }

    @action
    public reset() {
        this.values.username = '';
        this.values.email = '';
        this.values.password = '';
    }

    @action
    public register() {
        this.inProgress = true;
        this.errors = undefined;
        return agent.Auth.register(
            this.values.username,
            this.values.email,
            this.values.password
        )
            .then(({ user }) => {
                return commonStore.setToken(user.token);
            })
            .then(() => userStore.pullUser())
            .catch(
                action((err: any) => {
                    this.errors =
                        err &&
                        err.data &&
                        err.data.errors;
                    throw err;
                })
            )
            .finally(
                action(() => {
                    this.inProgress = false;
                })
            );
    }

    @action
    public logout() {
        commonStore.setToken('');
        userStore.forgetUser();
        return Promise.resolve();
    }
}

export default new AuthStore();
