import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';

import { Store } from 'redux';
import { getType } from 'typesafe-actions';
import { RootState } from 'store/root-reducer';
import { InitSocketConnection } from 'app/store/web-sockets/features/init-web-socked-connection/init-web-socket-connection';
import { WebsocketsConnected } from 'app/store/internet/features/websockets-connection/websockets-connected';
import { WebsocketsDisconnected } from 'app/store/internet/features/websockets-connection/websockets-disconnected';
import { CloseWebsocketConnection } from 'app/store/web-sockets/features/close-web-socket-connection/close-web-socket-connection';

let connection: HubConnection;

function openConnection(store: Store<RootState>): void {
  connection = new HubConnectionBuilder()
    .withUrl(`${process.env.NOTIFICATIONS_API}/signalr`, {
      logMessageContent: true,
      accessTokenFactory: () => store.getState().auth?.securityTokens?.accessToken!,
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => (retryContext.elapsedMilliseconds >= 10000 ? 10000 : retryContext.elapsedMilliseconds + 1000),
    })
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

export function signalRInvokeMiddleware(store: any): any {
  return (next: any) => async (action: any) => {
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
}
interface IIntegrationEvent {
  name: string;
  object: any;
}
