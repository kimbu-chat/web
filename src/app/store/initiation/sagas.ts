import { fork, spawn } from 'redux-saga/effects';
import { Init } from './features/init/init';
import { StartIdleWatcher } from './features/start-idle-watcher/start-idle-watcher';

export const InitiationSagas = [fork(Init.saga), spawn(StartIdleWatcher.saga)];

// yield spawn(watcher);
