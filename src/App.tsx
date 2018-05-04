import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import Header from './components/Header/Header';
import Register from './components/Register/Register';
import { CommonStore } from './stores/commonStore';
import { UserStore } from './stores/userStore';

import "./App.css";
import Login from './components/Login/Login';

interface InjectedProps extends Partial<RouteComponentProps<any>> {
    commonStore: CommonStore;
    userStore: UserStore;
}

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
        if(this.injectedProps.commonStore.appLoaded){
            return (
                <div>
                    <Header />
                    <Switch>
                        <Route path="/register" component={Register} />
                        <Route path="/login" component={Login} />
                    </Switch>
                </div>
            )
        }

        return <Header />;
    }
}

export default withRouter(App);
