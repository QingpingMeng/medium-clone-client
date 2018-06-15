import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Redirect, Route, RouteProps } from 'react-router';
import { CommonStore } from '../../stores/commonStore';
import { UserStore } from '../../stores/userStore';

export interface IInjectedPrivateRouteProps extends RouteProps {
    userStore: UserStore;
    commonStore: CommonStore;
}

@inject('userStore', 'commonStore')
@observer
export default class IInjectedPrivateRoute extends React.Component<
    RouteProps,
    any
> {
    get injectedProps() {
        return this.props as IInjectedPrivateRouteProps;
    }
    public render() {
        const { userStore, ...restProps } = this.injectedProps;
        if (userStore.currentUser) {
            return <Route {...restProps} />;
        }

        return <Redirect to="/" />;
    }
}
