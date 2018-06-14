import { action, observable } from 'mobx';
import agent from '../agent';
import { IProfile } from '../models/User.model';

export class ProfileStore {
    @observable public myProfile: IProfile;
    @observable public isLoadingProfile = false;
    @observable public profile: IProfile;

    @action
    public loadMyProfile(username: string) {
        return this.loadProfile(username).then(
            action(() => {
                this.myProfile = this.profile;
            })
        );
    }

    @action
    public loadProfile(username: string) {
        return agent.Profile.get(username)
            .then(
                action(({ profile }) => {
                    this.profile = profile;
                })
            )
            .finally(
                action(() => {
                    this.isLoadingProfile = false;
                })
            );
    }

    @action
    public follow() {
        if (this.profile && !this.profile.following) {
            this.profile.following = true;
            agent.Profile.follow(this.profile.username).catch(
                action(() => {
                    this.profile.following = false;
                })
            );
        }
    }

    @action
    public unfollow() {
        if (this.profile && this.profile.following) {
            this.profile.following = false;
            agent.Profile.unfollow(this.profile.username).catch(
                action(() => {
                    this.profile.following = true;
                })
            );
        }
    }
}

export default new ProfileStore();
