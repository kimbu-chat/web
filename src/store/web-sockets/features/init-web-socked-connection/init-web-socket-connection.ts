import {createAction} from '@reduxjs/toolkit';
import {ISecurityTokens} from "kimbu-models";
import {END, eventChannel, SagaIterator} from "redux-saga";
import {call, put, select, take} from "redux-saga/effects";

import {REACT_APP_WEBSOCKET_API} from "@common/paths";
import {refreshTokenAction, refreshTokenSuccessAction} from "@store/auth/actions";
import {securityTokensSelector} from "@store/auth/selectors";
import {websocketsConnectedAction, websocketsDisconnectedAction} from "@store/internet/actions";
import {getAccessTokenExpirationTime} from "@utils/get-access-token-expiration-time";

import type Centrifuge from 'centrifuge';

let connection: Centrifuge;
let CentrifugeModule: typeof Centrifuge;
const timeout = 5000;

interface IIntegrationEvent {
  name: string;
  object: unknown;
}

interface CentrifugoEvent {
  data: IIntegrationEvent;
}

async function loadCentrifugoModule(): Promise<void> {
  if (!CentrifugeModule) {
    CentrifugeModule = (await import('centrifuge')).default;
  }
}

type WebSocketEvent =
  { type: "refresh-token-needed", callback: (token: string) => void } |
  { type: "connected", } |
  { type: "disconnected" } |
  { type: "message-published", eventName: unknown, payload: unknown } |
  END;

function initWebsocket(accessToken: string) {
  return eventChannel<WebSocketEvent>(emitter => {

    const onRefreshTokensNeeded = (_: any, cb: (response: Centrifuge.RefreshResponse) => void) => {
      emitter( {
        type: "refresh-token-needed",
        callback: (token: string) => cb({
          status: 200,
          data: {
            token,
          },
        })});
    }

    connection = new CentrifugeModule(REACT_APP_WEBSOCKET_API, {
      debug: true,
      onRefresh: onRefreshTokensNeeded,
      timeout,
    });

    connection.setToken(accessToken);

    connection.connect();

    connection.on('connect', ()=> {
      emitter({ type: "connected"})
    });

    connection.on('broadcast', (ctx: CentrifugoEvent) => {
      const { data } = { ...ctx };
      emitter({ type: "message-published", eventName: data.name, payload: data.object})
    });

    connection.on('publish', (ctx: CentrifugoEvent) => {
      const { data } = { ...ctx };
      emitter({ type: "message-published", eventName: data.name, payload: data.object})
    });

    connection.on('disconnect', () => {
      emitter({ type: "disconnected"})
      emitter(END);
    });
    // unsubscribe function
    return () => {
      // eslint-disable-next-line no-console
      console.log('Socket off')
    }
  })
}

export class InitSocketConnection {
  static get action() {
    return createAction('INIT_SOCKET_CONNECTION');
  }

  static get saga() {
    return function* initWebSocketConnectionSaga(): SagaIterator {

      yield call(loadCentrifugoModule)

      let tokens: ISecurityTokens = yield select(securityTokensSelector);

      if(!tokens){
        return;
      }

      const expTime = new Date(getAccessTokenExpirationTime(tokens.accessToken));

      if (!expTime) {
        return;
      }

      expTime.setMilliseconds(expTime.getMilliseconds() - timeout);

      if (expTime < new Date()) {
        return;
      }

      if (connection && connection?.isConnected()) {
        return;
      }

      const channel = yield call(initWebsocket, tokens.accessToken);

      while (true) {
        const action: WebSocketEvent = yield take(channel)

        switch (action.type) {
          case "refresh-token-needed": {
            yield put(refreshTokenAction());
            tokens = yield take(refreshTokenSuccessAction);
            action.callback(tokens.accessToken);
            break;
          }
          case "connected": {
            yield put(websocketsConnectedAction());
            break;
          }
          case "disconnected": {
            yield put(websocketsDisconnectedAction());
            break;
          }
          case "message-published": {
            yield put({type: action.eventName, payload: action.payload});
            break;
          }
          case END.type: {
            yield put(websocketsDisconnectedAction());
            break;
          }
          default: {
            throw new Error(`No web socket event type found for: ${JSON.stringify(action)}`)
          }
        }
      }

      // yield take(closeSocketConnectionAction);

      // if (connection && connection.isConnected()) {
      //   connection.disconnect();
      // }
    };
  }
}
