import { getType } from '@reduxjs/toolkit';
import { Dispatch, Middleware, MiddlewareAPI } from 'redux';

import { REACT_APP_WEBSOCKET_API } from '@common/paths';
import { refreshTokenAction, refreshTokenSuccessAction } from '@store/auth/actions';
import { RootAction } from '@store/root-action';

import { RootState } from "../../index";
import { WebsocketsConnected } from '../../internet/features/websockets-connection/websockets-connected';
import { WebsocketsDisconnected } from '../../internet/features/websockets-connection/websockets-disconnected';
import { CloseWebsocketConnection } from '../../web-sockets/features/close-web-socket-connection/close-web-socket-connection';
import { InitSocketConnection } from '../../web-sockets/features/init-web-socked-connection/init-web-socket-connection';

import type Centrifuge from 'centrifuge';

let connection: Centrifuge;
let CentrifugeModule: typeof Centrifuge;
const timeout = 5000;
let refreshResponseCallback: (response: Centrifuge.RefreshResponse) => void;

async function openConnection(store: MiddlewareAPI<Dispatch, RootState>) {
  if (!CentrifugeModule) {
    CentrifugeModule = (await import('centrifuge')).default;
  }

  const onRefresh = (_: any, cb: (response: Centrifuge.RefreshResponse) => void) => {
    store.dispatch(refreshTokenAction());
    refreshResponseCallback = cb;
  };

  connection = new CentrifugeModule(REACT_APP_WEBSOCKET_API, {
    debug: true,
    onRefresh,
    timeout,
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

export const centrifugeInvokeMiddleware: Middleware<RootAction, RootState> =
  (store: MiddlewareAPI<Dispatch, RootState>) =>
  (next: Dispatch<RootAction>) =>
  async (action: RootAction): Promise<RootAction> => {
    switch (action.type) {
      case getType(InitSocketConnection.action): {
        const expTime = new Date(
          store.getState().auth?.securityTokens?.accessTokenExpirationTime || '',
        );

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
        } else if (action.payload.accessToken) {
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
