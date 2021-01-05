import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';

import { Store } from 'redux';
import { getType } from 'typesafe-actions';
import { AuthActions } from 'store/auth/actions';
import { RootState } from 'store/root-reducer';
import { InitSocketConnection } from 'app/store/sockets/features/init-socked-connection/init-socket-connection';

let connection: HubConnection;

function openConnection(store: Store<RootState>): void {
  connection = new HubConnectionBuilder()
    .withUrl(`${process.env.NOTIFICATIONS_API}/signalr`, {
      logMessageContent: true,
      accessTokenFactory: () => store.getState().auth.securityTokens.accessToken,
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.None)
    .build();

  connection
    .start()
    .then(() => {
      console.warn('CONNECTED WEBSOCKETS');
    })
    .catch((err: any) => {
      console.warn('ERROR WEBSOCKETS', err);
    });

  connection.on('notify', (event: IIntegrationEvent) => {
    console.warn('Event received. Data: ', event);

    store.dispatch({ type: event.name, payload: event.object });
  });

  connection.onreconnecting(() => {
    console.warn('RECONNECTING WEBSOCKETS');
  });

  connection.onreconnected(() => {
    console.warn('ON RECCONECTED WEBSOCKETS');
  });

  connection.onclose((err: any) => {
    console.warn('WEB SOCKET CONNECTION WAS LOST', err);
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
      case getType(AuthActions.logout): {
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
