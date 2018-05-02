import MenuIcon from '@material-ui/icons/Menu';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button/Button';
import IconButton from 'material-ui/IconButton';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import { CommonStore } from '../../stores/commonStore';
import { UserStore } from '../../stores/userStore';

import './Header.css';

interface InjectedHeaderProps extends RouteComponentProps<{}> {
    commonStore: CommonStore;
    userStore: UserStore;
}

@inject('userStore', 'commonStore')
@observer
class Header extends React.Component<RouteComponentProps<{}>, {}> {
    get injectedProps() {
        return this.props as InjectedHeaderProps;
    }

    public render() {
        const isLoggedIn = !!this.injectedProps.userStore.currentUser;
        const { currentUser } = this.injectedProps.userStore;

        return (
            <div className="header-container">
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            className="heaer-menu-button"
                            color="inherit"
                            aria-label="Menu"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="title"
                            color="inherit"
                            className="header-title"
                        >
                            Title
                        </Typography>
                        {!isLoggedIn && [
                            <Button key="home" onClick={this.linkTo('/')} color="inherit">
                                Home
                            </Button>,
                            <Button key="login" onClick={this.linkTo('/login')} color="inherit">
                                Login
                            </Button>,
                            <Button key="register" onClick={this.linkTo('/signup')} color="inherit">
                                Sign up
                            </Button>
                        ]}
                        {isLoggedIn && [
                            <Button key="home" color="inherit">
                                Home
                            </Button>,
                            <Button key="newPost" color="inherit">
                                New Post
                            </Button>,
                            <Button key="settings" color="inherit">
                                Settings
                            </Button>,
                            <IconButton key="avatar">
                                {currentUser && (
                                    <Avatar
                                        alt="Remy Sharp"
                                        src={currentUser.image}
                                        className="header-avatar"
                                    />
                                )}
                            </IconButton>
                        ]}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }

    private linkTo = (path: string) => {
        return (e: any) => {
            this.props.history.push(path);
        };
    }

}

export default withRouter(Header);

// <LoggedInView currentUser={this.props.userStore.currentUser} />
