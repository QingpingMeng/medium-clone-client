import Grid from '@material-ui/core/Grid';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { CommonStore } from '../../stores/commonStore';
import Banner from './Banner';
import MainView from './MainView';
import Sidebar from './Sidebar';

export interface InjectedHomeProps {
    commonStore: CommonStore;
}

@inject('commonStore')
@observer
export default class Home extends React.Component<any, any> {
    get injectedProps() {
        return this.props as InjectedHomeProps;
    }
    public componentDidMount() {
        this.injectedProps.commonStore.loadTags();
    }
    public render() {
        const {
            token,
            appName,
            appSlogan,
            tags
        } = this.injectedProps.commonStore;
        return (
            <Grid container={true} justify="center">
                <Grid item={true} md={12}>
                    <Banner
                        token={token}
                        appName={appName}
                        appSlogan={appSlogan}
                    />
                </Grid>
                <Grid container={true} justify="center">
                    <MainView />
                    <Sidebar tags={tags} />
                </Grid>
            </Grid>
        );
    }
}
