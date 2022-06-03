import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { put, call, select, take, delay, spawn } from 'redux-saga/effects';

import { authenticatedSelector } from '@store/auth/selectors';

import { getInternetStateSelector, getWebsocketStateSelector } from '../../selectors';
import { WebsocketsDisconnected } from '../websockets-connection/websockets-disconnected';

import { InternetConnected } from './internet-connected';
import { InternetDisconnected } from './internet-disconnected';

function* watchInternetConnectionChange(): SagaIterator {
  const ping = (): Promise<boolean> =>
    new Promise((resolve) => {
      const isOnline = () => resolve(true);
      const isOffline = () => resolve(false);

      fetch(`/file-for-ping.txt?d=${Date.now()}`)
        .then((response) => {
          if (response.ok) {
            isOnline();
          } else {
            isOffline();
          }
        })
        .catch(isOffline);
    });

  while (true) {
    const websocketConnected = yield select(getWebsocketStateSelector);

    yield delay(3000);

    if (websocketConnected) {
      yield take(WebsocketsDisconnected.action);
    }
    const internetState = yield call(ping);
    const storeInternetState = yield select(getInternetStateSelector);

    const offlineMessage = ' [Offline]';

    if (internetState !== storeInternetState) {
      if (internetState) {
        yield put(InternetConnected.action());
        [window.document.title] = window.document.title.split(offlineMessage);
      } else {
        yield put(InternetDisconnected.action());
        if (!window.document.title.includes(offlineMessage)) {
          window.document.title += offlineMessage;
        }
      }
    }
  }
}

export class StartInternetConnectionStateChangeWatcher {
  static get action() {
    return createAction('START_INTERNET_CONNECTION_WATCHER');
  }

  static get saga() {
    return function* intervalInternetConnectionCheckSaga(): SagaIterator {
      const authenticated = yield select(authenticatedSelector);

      if (!authenticated) {
        return;
      }

      yield spawn(watchInternetConnectionChange);
    };
  }
}
