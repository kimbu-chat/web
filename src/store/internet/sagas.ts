import { spawn, all, takeLeading } from 'redux-saga/effects';

import { CloseWebsocketConnection } from '@store/internet/features/close-web-socket-connection/close-web-socket-connection';
import { InitSocketConnection } from '@store/internet/features/init-web-socked-connection/init-web-socket-connection';

import { StartInternetConnectionStateChangeWatcher } from './features/internet-connection-check/start-internet-connection-state-change-watcher';

export function* internetSagas() {
  yield all([
    spawn(StartInternetConnectionStateChangeWatcher.saga),
    takeLeading(InitSocketConnection.action, InitSocketConnection.saga),
    takeLeading(CloseWebsocketConnection.action, CloseWebsocketConnection.saga),
  ]);
}
