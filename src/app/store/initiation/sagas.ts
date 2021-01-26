import { spawn, takeLeading } from 'redux-saga/effects';
import { Init } from './features/init/init';
import { StartIdleStateChangeWatcher } from './features/start-idle-state-change-watcher/start-idle-state-change-watcher';

export const InitiationSagas = [spawn(Init.saga), takeLeading(StartIdleStateChangeWatcher.action, StartIdleStateChangeWatcher.saga)];
