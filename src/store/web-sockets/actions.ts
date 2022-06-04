import { CloseWebsocketConnection } from './features/close-web-socket-connection/close-web-socket-connection';
import { InitSocketConnection } from './features/init-web-socked-connection/init-web-socket-connection';

export const initSocketConnectionAction = InitSocketConnection.action;
export const closeSocketConnectionAction = CloseWebsocketConnection.action;

export type WebSocketActions =
  typeof initSocketConnectionAction &
  typeof closeSocketConnectionAction;
