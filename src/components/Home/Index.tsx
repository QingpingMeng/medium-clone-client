import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { CommonStore } from '../../stores/commonStore';
import Banner from './Banner'
import MainView from './MainView'
import Sidebar from './Sidebar'

export interface InjectedHomeProps {
    commonStore: CommonStore;
}

@observer
@inject('commonStore')
export default class Home extends React.Component<any, any> {
    get injectedProps() {
        return this.props as InjectedHomeProps;
    }
  public render() {
      const {token, appName} = this.injectedProps.commonStore;
    return (
      <div>
        <Banner token={token} appName={appName} />
        <MainView />
        <Sidebar />
      </div>
    );
  }
}
