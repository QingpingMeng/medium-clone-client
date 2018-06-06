import {Provider} from 'mobx-react';
import * as promiseFinally from 'promise.prototype.finally';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import articlesStore from './stores/articlesStore';
import authStore from './stores/authStore'
import commonStore from './stores/commonStore';
import editorStore from './stores/editorStore';
import profileStore from './stores/profileStore';
import userStore from './stores/userStore';

const stores ={ 
  articlesStore,
  authStore,
  commonStore,
  editorStore,
  profileStore,
  userStore
};

promiseFinally.shim();

ReactDOM.render(
  <Provider {...stores}>
    <BrowserRouter >
     <App />
    </BrowserRouter>
  </Provider>
  ,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
