import { action, observable } from 'mobx';
import agent from '../agent';
import IUser from '../models/User.model';

class ProfileStore {
    @observable public myProfile: IUser;
    @observable public isLoadingProfile = false;

    @action
    public loadMyProfile(username: string){
        agent.Profile.get(username)
        .then(action(({ profile }) => { this.myProfile = profile; }))
        .finally(action(() => { this.isLoadingProfile = false; }))
    }
}

export default new ProfileStore();