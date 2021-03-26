import { spawn, takeLeading } from 'redux-saga/effects';
import { AppInit } from './features/app-init/app-init';
import { StartIdleStateChangeWatcher } from './features/start-idle-state-change-watcher/start-idle-state-change-watcher';

export const InitiationSagas = [spawn(AppInit.saga), takeLeading(StartIdleStateChangeWatcher.action, StartIdleStateChangeWatcher.saga)];
