import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { closeWebSocketConnection } from '../common/websocket-listener';

export class CloseWebsocketConnection {
  static get action() {
    return createAction('CLOSE_WEB_SOCKET_CONNECTION');
  }

  static get saga() {
    return function* saga(): SagaIterator {
      yield call(closeWebSocketConnection);
    };
  }
}
