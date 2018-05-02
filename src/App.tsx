import { inject, observer } from 'mobx-react';
import * as React from 'react';
import Header from './components/Header/Header';
import { CommonStore } from './stores/commonStore';

interface InjectedProps {
    commonStore: CommonStore;
}

@inject('commonStore')
@observer
class App extends React.Component<{}, {}> {
    get injectedProps() {
        return this.props as InjectedProps;
    }

    public render() {
        return (
          <Header />
        )
    }
}

export default App;
