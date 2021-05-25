import { all, takeLeading } from 'redux-saga/effects';

import { AppInit } from './features/app-init/app-init';
import { StartIdleStateChangeWatcher } from './features/start-idle-state-change-watcher/start-idle-state-change-watcher';

export function* initiationSaga() {
  yield all([
    takeLeading(StartIdleStateChangeWatcher.action, StartIdleStateChangeWatcher.saga),
    takeLeading(AppInit.action, AppInit.saga),
  ]);
}
