import Button from '@material-ui/core//Button';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { CommonStore } from '../../stores/commonStore';
import { UserStore } from '../../stores/userStore';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { AuthStore } from '../../stores/authStore';
import './Header.css';

interface InjectedHeaderProps extends RouteComponentProps<{}> {
    commonStore: CommonStore;
    userStore: UserStore;
    authStore: AuthStore;
}

interface IHeaderState {
    menuAnchorEl: HTMLElement | undefined;
}

@inject('userStore', 'commonStore', 'authStore')
@observer
class Header extends React.Component<RouteComponentProps<{}>, IHeaderState> {
    get injectedProps() {
        return this.props as InjectedHeaderProps;
    }

    constructor(props: InjectedHeaderProps) {
        super(props);

        this.state = {
            menuAnchorEl: undefined
        };
    }
    public render() {
        const isLoggedIn = !!this.injectedProps.userStore.currentUser;
        const { currentUser } = this.injectedProps.userStore;
        const { menuAnchorEl } = this.state;
        return (
            <div className="header-container">
                <AppBar position="sticky" color="default">
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
                            <Button
                                key="home"
                                onClick={this.linkTo('/')}
                                color="inherit"
                            >
                                Home
                            </Button>,
                            <Button
                                key="login"
                                onClick={this.linkTo('/login')}
                                color="inherit"
                            >
                                Login
                            </Button>,
                            <Button
                                key="register"
                                onClick={this.linkTo('/register')}
                                color="inherit"
                            >
                                Sign up
                            </Button>
                        ]}
                        {isLoggedIn && [
                            <Button
                                key="home"
                                onClick={this.linkTo('/')}
                                color="inherit"
                            >
                                Home
                            </Button>,
                            <Button
                                onClick={this.linkTo('/editor/')}
                                key="newPost"
                                color="inherit"
                            >
                                New Post
                            </Button>,
                            <IconButton
                                key="avatar"
                                onClick={this.handleMenuClick}
                            >
                                {currentUser && (
                                    <Avatar
                                        alt="Remy Sharp"
                                        src={
                                            currentUser.image ||
                                            'https://static.productionready.io/images/smiley-cyrus.jpg'
                                        }
                                        className="header-avatar"
                                    />
                                )}
                            </IconButton>,
                            <Menu
                                key="menu"
                                id="simple-menu"
                                anchorEl={menuAnchorEl}
                                open={Boolean(menuAnchorEl)}
                                onClose={this.handleMenuClose()}
                            >
                                <MenuItem onClick={this.handleMenuClose('/settings/')}>
                                    Settings
                                </MenuItem>
                                <MenuItem onClick={this.handleLogout}>
                                    Logout
                                </MenuItem>
                            </Menu>
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
    };

    private handleMenuClose = (path?: string) => _ => {
        this.setState({
            menuAnchorEl: undefined
        });

        if(path){
            this.props.history.push(path);
        }
    };

    private handleMenuClick = (e: React.MouseEvent<HTMLElement>) => {
        this.setState({
            menuAnchorEl: e.currentTarget
        });
    };

    private handleLogout = _ => {
        this.injectedProps.authStore.logout();
        this.props.history.push('/');
    };
}

export default withRouter(Header);
