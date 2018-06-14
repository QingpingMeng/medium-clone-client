import { inject, observer } from 'mobx-react';
import * as React from 'react';
import {
    Route,
    RouteComponentProps,
    Switch,
    withRouter
} from 'react-router-dom';
import Header from './components/Header/Header';
import Register from './components/Register/Register';
import { CommonStore } from './stores/commonStore';
import { UserStore } from './stores/userStore';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import './App.css';
import ArticleDetail from './components/Articles/ArticleDetail';
import EditArticle from './components/Articles/EditArticle';
import Home from './components/Home/Index';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';

interface InjectedProps extends Partial<RouteComponentProps<any>> {
    commonStore: CommonStore;
    userStore: UserStore;
}

const theme = createMuiTheme({
    palette: {
        primary: {
            dark: '#0097a7',
            light: '#bdbdbd',
            main: '#2196f3'
        }
    }
});

@inject('commonStore', 'userStore')
@observer
class App extends React.Component<RouteComponentProps<any>, never> {
    get injectedProps() {
        return this.props as InjectedProps;
    }

    public componentWillMount() {
        if (!this.injectedProps.commonStore.token) {
            this.injectedProps.commonStore.setAppLoaded();
        }
    }

    public componentDidMount() {
        if (this.injectedProps.commonStore.token) {
            this.injectedProps.userStore
                .pullUser()
                .finally(() => this.injectedProps.commonStore.setAppLoaded());
        }
    }

    public render() {
        if (this.injectedProps.commonStore.appLoaded) {
            return (
                <div>
                    <MuiThemeProvider theme={theme}>
                        <Header />
                        <Switch>
                            <Route path="/register" component={Register} />
                            <Route path="/login" component={Login} />
                            <Route path="/" exact={true} component={Home} />
                            <Route
                                path="/articles/:id"
                                exact={true}
                                component={ArticleDetail}
                            />
                            <Route
                                path="/editor/:slug?"
                                exact={true}
                                component={EditArticle}
                            />
                            <Route path="/@:username" component={Profile} />
                            <Route
                                path="/@:username/favorites"
                                component={Profile}
                            />
                        </Switch>
                    </MuiThemeProvider>
                </div>
            );
        }

        return <Header />;
    }
}

export default withRouter(App);
