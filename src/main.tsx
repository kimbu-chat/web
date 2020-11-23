import React from 'react';
import ReactDOM from 'react-dom';
//import * as Sentry from '@sentry/react';
//import { Integrations } from '@sentry/tracing';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import createStore from './app/store';
import { Router } from 'react-router';
import { App } from './app/app';

// Sentry.init({
// 	dsn: 'https://88240f4812e54397a554e2e35bc7ef32@o116167.ingest.sentry.io/5524434',
// 	integrations: [new Integrations.BrowserTracing()],
// 	logLevel: 1,
// 	allowUrls: ['https://ravudi.com'],
// 	// We recommend adjusting this value in production, or using tracesSampler
// 	// for finer control
// 	tracesSampleRate: 1.0,
// });

// prepare store
export const history = createBrowserHistory();

const store = createStore();

ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			<App />
		</Router>
	</Provider>,
	document.getElementById('root'),
);
