import { END, eventChannel } from 'redux-saga';

import { REACT_APP_WEBSOCKET_API } from '@common/paths';

import type Centrifuge from 'centrifuge';

let connection: Centrifuge;
let CentrifugeModule: typeof Centrifuge;
export const WEBSOCKET_TIMEOUT = 5000;

interface IIntegrationEvent {
  name: string;
  object: unknown;
}

interface CentrifugoEvent {
  data: IIntegrationEvent;
}

export async function loadCentrifugoModule(): Promise<void> {
  if (!CentrifugeModule) {
    CentrifugeModule = (await import('centrifuge')).default;
  }
}

export type WebSocketEvent =
  | { type: 'refresh-token-needed'; callback: (token: string) => void }
  | { type: 'connected' }
  | { type: 'disconnected' }
  | { type: 'message-published'; eventName: unknown; payload: unknown }
  | END;

export function closeWebSocketConnection(): void {
  if (connection && connection.isConnected()) {
    connection.disconnect();
  }
}

export function openWebSocketConnection(accessToken: string) {
  return eventChannel<WebSocketEvent>((emitter) => {
    const onRefreshTokensNeeded = (_: any, cb: (response: Centrifuge.RefreshResponse) => void) => {
      emitter({
        type: 'refresh-token-needed',
        callback: (token: string) =>
          cb({
            status: 200,
            data: {
              token,
            },
          }),
      });
    };

    connection = new CentrifugeModule(REACT_APP_WEBSOCKET_API, {
      debug: true,
      onRefresh: onRefreshTokensNeeded,
      timeout: WEBSOCKET_TIMEOUT,
    });

    connection.setToken(accessToken);

    connection.connect();

    connection.on('connect', () => {
      emitter({ type: 'connected' });
    });

    connection.on('broadcast', (ctx: CentrifugoEvent) => {
      const { data } = { ...ctx };
      emitter({ type: 'message-published', eventName: data.name, payload: data.object });
    });

    connection.on('publish', (ctx: CentrifugoEvent) => {
      const { data } = { ...ctx };
      emitter({ type: 'message-published', eventName: data.name, payload: data.object });
    });

    connection.on('disconnect', () => {
      emitter({ type: 'disconnected' });
      emitter(END);
    });
    // unsubscribe function
    return () => {
      // eslint-disable-next-line no-console
      console.log('Socket off');
    };
  });
}
