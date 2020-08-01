import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import createStore from './app/store';
import { Router } from 'react-router';
import { App } from './app/app';

// prepare store
export const history = createBrowserHistory();

const store = createStore();

ReactDOM.render(
		<Provider store={store}>
    <Router history={history}>
      <App />
																		</Router>
  </Provider>,
  document.getElementById('root')
);
