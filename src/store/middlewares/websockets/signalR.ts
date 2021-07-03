import Centrifuge, { RefreshResponse } from 'centrifuge';
import { Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { getType, RootAction, RootState } from 'typesafe-actions';

import { REACT_APP_WEBSOCKET_API } from '@common/paths';
import { refreshTokenAction, refreshTokenSuccessAction } from '@store/auth/actions';

import { WebsocketsConnected } from '../../internet/features/websockets-connection/websockets-connected';
import { WebsocketsDisconnected } from '../../internet/features/websockets-connection/websockets-disconnected';
import { CloseWebsocketConnection } from '../../web-sockets/features/close-web-socket-connection/close-web-socket-connection';
import { InitSocketConnection } from '../../web-sockets/features/init-web-socked-connection/init-web-socket-connection';

let connection: Centrifuge;
const timeout = 5000;
let refreshResponseCallback: (response: RefreshResponse) => void;

function openConnection(store: MiddlewareAPI<Dispatch, RootState>): void {
  connection = new Centrifuge(REACT_APP_WEBSOCKET_API, {
    debug: true,
    timeout,
  });

  const onRefresh = (_: any, cb: (response: RefreshResponse) => void) => {
    store.dispatch(refreshTokenAction());
    refreshResponseCallback = cb;
  };

  connection = new Centrifuge(REACT_APP_WEBSOCKET_API, {
    debug: true,
    onRefresh,
  });

  connection.setToken(store.getState().auth?.securityTokens?.accessToken || '');

  connection.connect();

  connection.on('connect', () => {
    store.dispatch(WebsocketsConnected.action());
  });

  connection.on('broadcast', (ctx: CentrifugoEvent) => {
    const { data } = { ...ctx };
    store.dispatch({ type: data.name, payload: data.object });
  });

  connection.on('publish', (ctx: CentrifugoEvent) => {
    const { data } = { ...ctx };
    store.dispatch({ type: data.name, payload: data.object });
  });

  // connection.onreconnecting(() => {
  //   store.dispatch(WebsocketsDisconnected.action());
  // });

  // connection.onreconnected(() => {
  //   store.dispatch(WebsocketsConnected.action());
  // });

  connection.on('disconnect', () => {
    store.dispatch(WebsocketsDisconnected.action());
  });
}

export const signalRInvokeMiddleware: Middleware<RootAction, RootState> =
  (store: MiddlewareAPI<Dispatch, RootState>) =>
  (next: Dispatch<RootAction>) =>
  async (action: RootAction): Promise<RootAction> => {
    switch (action.type) {
      case getType(InitSocketConnection.action): {
        const expTime = store.getState().auth?.securityTokens?.accessTokenExpirationTime;

        if (!expTime) {
          return next(action);
        }

        expTime.setMilliseconds(expTime.getMilliseconds() - timeout);

        if (expTime < new Date()) {
          return next(action);
        }

        if (!connection || !connection.isConnected()) {
          openConnection(store);
        }

        return next(action);
      }
      case getType(CloseWebsocketConnection.action): {
        if (connection && connection.isConnected()) {
          connection.disconnect();
        }
        return next(action);
      }
      case getType(refreshTokenSuccessAction): {
        if (!refreshResponseCallback) {
          openConnection(store);
        } else {
          refreshResponseCallback({
            status: 200,
            data: {
              token: action.payload.accessToken,
            },
          });
        }

        return next(action);
      }

      default:
        return next(action);
    }
  };

interface IIntegrationEvent {
  name: string;
  object: unknown;
}

interface CentrifugoEvent {
  data: IIntegrationEvent;
}
