import { CloseWebsocketConnection } from './features/close-web-socket-connection/close-web-socket-connection';
import { InitSocketConnection } from './features/init-web-socked-connection/init-web-socket-connection';

export const initSocketConnection = InitSocketConnection.action;
export const closeSocketConnection = CloseWebsocketConnection.action;
