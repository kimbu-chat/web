// import './wdyr';

import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { App } from 'app/app';
import createStore from './app/store';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://88240f4812e54397a554e2e35bc7ef32@o116167.ingest.sentry.io/5524434',
    integrations: [new Integrations.BrowserTracing()],
    logLevel: 1,
    allowUrls: ['https://ravudi.com'],
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
