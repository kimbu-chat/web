import { createAction } from '@reduxjs/toolkit';
import { ISecurityTokens } from 'kimbu-models';
import { END, SagaIterator } from 'redux-saga';
import { call, put, select, take } from 'redux-saga/effects';

import { refreshTokenAction, refreshTokenSuccessAction } from '@store/auth/actions';
import { securityTokensSelector } from '@store/auth/selectors';
import {
  openWebSocketConnection,
  loadCentrifugoModule,
  WEBSOCKET_TIMEOUT,
  WebSocketEvent,
} from '@store/internet/features/common/websocket-listener';
import { WebsocketsConnected } from '@store/internet/features/websockets-connection/websockets-connected';
import { WebsocketsDisconnected } from '@store/internet/features/websockets-connection/websockets-disconnected';
import { getAccessTokenExpirationTime } from '@utils/get-access-token-expiration-time';

export class InitSocketConnection {
  static get action() {
    return createAction('INIT_SOCKET_CONNECTION');
  }

  static get saga() {
    return function* initWebSocketConnectionSaga(): SagaIterator {
      yield call(loadCentrifugoModule);

      let tokens: ISecurityTokens = yield select(securityTokensSelector);

      if (!tokens) {
        return;
      }

      const expTime = new Date(getAccessTokenExpirationTime(tokens.accessToken));

      if (!expTime) {
        return;
      }

      expTime.setMilliseconds(expTime.getMilliseconds() - WEBSOCKET_TIMEOUT);

      if (expTime < new Date()) {
        return;
      }

      const channel = yield call(openWebSocketConnection, tokens.accessToken);

      while (true) {
        const action: WebSocketEvent = yield take(channel);

        switch (action.type) {
          case 'refresh-token-needed': {
            yield put(refreshTokenAction());
            tokens = yield take(refreshTokenSuccessAction);
            action.callback(tokens.accessToken);
            break;
          }
          case 'connected': {
            yield put(WebsocketsConnected.action());
            break;
          }
          case 'disconnected': {
            yield put(WebsocketsDisconnected.action());
            break;
          }
          case 'message-published': {
            yield put({ type: action.eventName, payload: action.payload });
            break;
          }
          case END.type: {
            yield put(WebsocketsConnected.action());
            break;
          }
          default: {
            throw new Error(`No web socket event type found for: ${JSON.stringify(action)}`);
          }
        }
      }
    };
  }
}
