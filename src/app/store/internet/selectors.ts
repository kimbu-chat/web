import { RootState } from '../root-reducer';

export const getInternetStateSelector = (state: RootState): boolean => state.internet.isInternetConnected;

export const getWebsocketStateSelector = (state: RootState): boolean => state.internet.isWebSocketConnected;
