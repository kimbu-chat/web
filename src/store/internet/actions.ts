import { InternetConnected } from './features/internet-connection-check/internet-connected';
import { InternetDisconnected } from './features/internet-connection-check/internet-disconnected';
import { WebsocketsConnected } from './features/websockets-connection/websockets-connected';
import { WebsocketsDisconnected } from './features/websockets-connection/websockets-disconnected';

// InternetActions
export const internetConnectedAction = InternetConnected.action;
export const internetDisconnectedAction = InternetDisconnected.action;
export const websocketsConnectedAction = WebsocketsConnected.action;
export const websocketsDisconnectedAction = WebsocketsDisconnected.action;

export const InternetActions = {
  internetConnectedAction,
  internetDisconnectedAction,
  websocketsConnectedAction,
  websocketsDisconnectedAction,
};
