import { createReducer } from '@reduxjs/toolkit';

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

const reducer = createReducer<IInternetState>(initialState, (builder) =>
  builder
    .addCase(InternetConnected.action, InternetConnected.reducer)
    .addCase(InternetDisconnected.action, InternetDisconnected.reducer)
    .addCase(WebsocketsConnected.action, WebsocketsConnected.reducer)
    .addCase(WebsocketsDisconnected.action, WebsocketsDisconnected.reducer),
);

export default reducer;
