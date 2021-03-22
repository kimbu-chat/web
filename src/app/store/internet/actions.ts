import { InternetConnected } from './features/internet-connection-check/internet-connected';
import { InternetDisconnected } from './features/internet-connection-check/internet-disconnected';
import { WebsocketsConnected } from './features/websockets-connection/websockets-connected';
import { WebsocketsDisconnected } from './features/websockets-connection/websockets-disconnected';

// InternetActions
export const internetConnected = InternetConnected.action;
export const internetDisconnected = InternetDisconnected.action;
export const websocketsConnected = WebsocketsConnected.action;
export const websocketsDisconnected = WebsocketsDisconnected.action;
