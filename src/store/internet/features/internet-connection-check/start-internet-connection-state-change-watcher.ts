import { SagaIterator } from 'redux-saga';
import { put, call, select, take, delay, spawn } from 'redux-saga/effects';

import { authenticatedSelector } from '@store/auth/selectors';
import { createEmptyAction } from '@store/common/actions';

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

    const isInternetConnected = yield select(getInternetStateSelector);

    if (internetState === isInternetConnected) {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (internetState) {
      yield put(InternetConnected.action());
      [window.document.title] = window.document.title.split(' [offline]');
    } else {
      yield put(InternetDisconnected.action());
      if (!window.document.title.includes(' [offline]')) {
        window.document.title += ' [Offline]';
      }
    }
  }
}

export class StartInternetConnectionStateChangeWatcher {
  static get action() {
    return createEmptyAction('START_INTERNET_CONNECTION_WATCHER');
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
