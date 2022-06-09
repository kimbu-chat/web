import { CloseWebsocketConnection } from '@store/internet/features/close-web-socket-connection/close-web-socket-connection';
import { InitSocketConnection } from '@store/internet/features/init-web-socked-connection/init-web-socket-connection';

import { InternetConnected } from './features/internet-connection-check/internet-connected';
import { InternetDisconnected } from './features/internet-connection-check/internet-disconnected';
import { WebsocketsConnected } from './features/websockets-connection/websockets-connected';
import { WebsocketsDisconnected } from './features/websockets-connection/websockets-disconnected';

// InternetActions
export const internetConnectedAction = InternetConnected.action;
export const internetDisconnectedAction = InternetDisconnected.action;
export const websocketsConnectedAction = WebsocketsConnected.action;
export const websocketsDisconnectedAction = WebsocketsDisconnected.action;

export const initSocketConnectionAction = InitSocketConnection.action;
export const closeSocketConnectionAction = CloseWebsocketConnection.action;

export type InternetActions = typeof internetConnectedAction &
  typeof internetDisconnectedAction &
  typeof websocketsConnectedAction &
  typeof websocketsDisconnectedAction &
  typeof initSocketConnectionAction &
  typeof closeSocketConnectionAction;
