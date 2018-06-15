import { Button, CircularProgress, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid/Grid';
import Tab from '@material-ui/core/Tab/Tab';
import Tabs from '@material-ui/core/Tabs/Tabs';
import ErrorIcon from '@material-ui/icons/Error';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ArticlesStore } from '../../stores/articlesStore';
import { ProfileStore } from '../../stores/profileStore';
import { UserStore } from '../../stores/userStore';
import ArticleList from '../Articles/ArticleList';
import CenterPage from '../Shared/CenterPaper';

import './Profile.css';

interface IRouteParasm {
    username: string;
}

export interface IProfileProps extends RouteComponentProps<IRouteParasm> {}

interface IInjectedProfileProps extends IProfileProps {
    userStore: UserStore;
    articlesStore: ArticlesStore;
    profileStore: ProfileStore;
}

@inject('articlesStore', 'profileStore', 'userStore')
@observer
class Profile extends React.Component<IProfileProps, any> {
    get injectedProps() {
        return this.props as IInjectedProfileProps;
    }

    public componentWillMount() {
        this.injectedProps.articlesStore.setPredicate(this.getPredicate());
    }

    public componentDidMount() {
        this.injectedProps.profileStore.loadProfile(
            this.props.match.params.username
        );
        this.injectedProps.articlesStore.loadArticles();
    }

    public componentDidUpdate(previousProps: IInjectedProfileProps) {
        if (this.props.location !== previousProps.location) {
            this.injectedProps.profileStore.loadProfile(
                this.props.match.params.username
            );
            this.injectedProps.articlesStore.setPredicate(this.getPredicate());
            this.injectedProps.articlesStore.loadArticles();
        }
    }

    public render() {
        const { profileStore, articlesStore, userStore } = this.injectedProps;
        const { profile, isLoadingProfile } = profileStore;

        if (isLoadingProfile) {
            return <CircularProgress size={20} />;
        }

        if (!profile) {
            return (
                <div>
                    <CenterPage>
                        <Typography
                            paragraph={true}
                            align="center"
                            color="error"
                            variant="display1"
                        >
                            <ErrorIcon style={{ fontSize: 30 }} /> No profile found.
                        </Typography>
                    </CenterPage>
                </div>
            );
        }

        const { currentUser } = userStore;

        const isUser = currentUser && profile.username === currentUser.username;
        const tabIndex = this.props.location.pathname.match('/favorites')
            ? 1
            : 0;
        return (
            <Grid container={true} justify="center">
                <Grid
                    key="userInfo"
                    className="profile-user-info-container"
                    container={true}
                    justify="center"
                >
                    <Grid item={true} md={6}>
                        <img
                            className="profile-user-info-avatar"
                            src="https://static.productionready.io/images/smiley-cyrus.jpg"
                        />
                        <Typography variant="title">
                            {profile.username}{' '}
                        </Typography>
                        {!isUser && (
                            <Button
                                style={{ float: 'right', fontSize: '0.6rem' }}
                                variant="outlined"
                                color="inherit"
                                size="small"
                                onClick={this.handleFollowChange}
                            >
                                + {!profile.following ? 'Follow' : 'Unfollow'}{' '}
                                {profile.username}
                            </Button>
                        )}
                        {isUser && (
                            <Button
                                style={{ float: 'right', fontSize: '0.6rem' }}
                                variant="outlined"
                                color="inherit"
                                size="small"
                            >
                                Edit Profile Settings
                            </Button>
                        )}
                    </Grid>
                </Grid>
                <Grid
                    key="tab"
                    style={{ marginTop: '1rem', padding: '0 1rem' }}
                    item={true}
                    md={6}
                >
                    <Tabs
                        value={tabIndex}
                        indicatorColor="primary"
                        onChange={this.handleTabChange}
                        textColor="primary"
                        fullWidth={true}
                    >
                        <Tab key="myArticle" label="My Articles" />
                        <Tab key="favArticle" label="Favorited Articles" />
                    </Tabs>
                    <ArticleList
                        articles={articlesStore.articles}
                        loading={articlesStore.isLoading}
                        totalPagesCount={articlesStore.totalPagesCount}
                        currentPage={articlesStore.page}
                        onSetPage={this.handleSetPage}
                    />
                </Grid>
            </Grid>
        );
    }

    private getPredicate = () => {
        switch (this.getTab()) {
            case 'favorites':
                return { favoritedBy: this.props.match.params.username };
            default:
                return { author: this.props.match.params.username };
        }
    };

    private handleSetPage = (page: number) => {
        this.injectedProps.articlesStore.setPage(page);
        this.injectedProps.articlesStore.loadArticles();
    };

    private getTab = () => {
        if (/\/favorites/.test(this.props.location.pathname)) {
            return 'favorites';
        }
        return 'all';
    };

    private handleTabChange = (event: React.ChangeEvent<{}>, value: any) => {
        if (value === 0) {
            this.props.history.push(`/@${this.props.match.params.username}`);
        } else {
            this.props.history.push(
                `@${this.props.match.params.username}/favorites`
            );
        }
    };

    private handleFollowChange = (event: React.ChangeEvent<{}>) => {
        const { profile } = this.injectedProps.profileStore;
        if (profile) {
            if (profile.following) {
                this.injectedProps.profileStore.unfollow();
            } else {
                this.injectedProps.profileStore.follow();
            }
        }
    };
}

export default withRouter(Profile);
