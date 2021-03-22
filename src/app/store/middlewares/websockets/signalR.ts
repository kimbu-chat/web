import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';

import { Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { getType, RootAction, RootState } from 'typesafe-actions';
import { InitSocketConnection } from '../../web-sockets/features/init-web-socked-connection/init-web-socket-connection';
import { WebsocketsConnected } from '../../internet/features/websockets-connection/websockets-connected';
import { WebsocketsDisconnected } from '../../internet/features/websockets-connection/websockets-disconnected';
import { CloseWebsocketConnection } from '../../web-sockets/features/close-web-socket-connection/close-web-socket-connection';

let connection: HubConnection;

function openConnection(store: MiddlewareAPI<Dispatch, RootState>): void {
  connection = new HubConnectionBuilder()
    .withUrl(`${process.env.NOTIFICATIONS_API}/signalr`, {
      logMessageContent: true,
      accessTokenFactory: () => {
        const accessToken = store.getState().auth?.securityTokens?.accessToken;
        if (accessToken) {
          return accessToken;
        }

        return '';
      },
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.None)
    .build();

  connection.start().then(() => {
    store.dispatch(WebsocketsConnected.action());
  });

  connection.on('notify', (event: IIntegrationEvent) => {
    // console.log(`event name: ${event.name} payload: ${JSON.stringify(event.object)}`);
    store.dispatch({ type: event.name, payload: event.object });
  });

  connection.onreconnecting(() => {
    store.dispatch(WebsocketsDisconnected.action());
  });

  connection.onreconnected(() => {
    store.dispatch(WebsocketsConnected.action());
  });

  connection.onclose(() => {
    store.dispatch(WebsocketsDisconnected.action());
  });
}

export const signalRInvokeMiddleware: Middleware<RootAction, RootState> = (store: MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch<RootAction>) => async (
  action: RootAction,
): Promise<RootAction> => {
  switch (action.type) {
    case getType(InitSocketConnection.action): {
      if (!connection || connection.state === HubConnectionState.Disconnected || connection.state !== HubConnectionState.Connecting) {
        openConnection(store);
      }
      return next(action);
    }
    case getType(CloseWebsocketConnection.action): {
      if (connection && connection.state === HubConnectionState.Connected) {
        connection.stop();
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
