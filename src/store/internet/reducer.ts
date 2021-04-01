import { createReducer } from 'typesafe-actions';
import { InternetConnected } from './features/internet-connection-check/internet-connected';
import { InternetDisconnected } from './features/internet-connection-check/internet-disconnected';
import { WebsocketsConnected } from './features/websockets-connection/websockets-connected';
import { WebsocketsDisconnected } from './features/websockets-connection/websockets-disconnected';
import { IInternetState } from './internet-state';

const initialState: IInternetState = {
  isInternetConnected:
    typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
      ? navigator.onLine
      : true,
  isWebSocketConnected: false,
};

const internet = createReducer<IInternetState>(initialState)
  .handleAction(InternetConnected.action, InternetConnected.reducer)
  .handleAction(InternetDisconnected.action, InternetDisconnected.reducer)
  .handleAction(WebsocketsConnected.action, WebsocketsConnected.reducer)
  .handleAction(WebsocketsDisconnected.action, WebsocketsDisconnected.reducer);

export default internet;
