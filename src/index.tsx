// import './wdyr';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import createStore from '@store';

import { register } from './serviceWorkerRegistration';
import { App } from './app';

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App store={store} />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);

register();
