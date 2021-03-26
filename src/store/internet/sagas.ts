import { spawn } from 'redux-saga/effects';
import {
  StartInternetConnectionStateChangeWatcher,
} from './features/internet-connection-check/start-internet-connection-state-change-watcher';

export const InternetSagas = [spawn(StartInternetConnectionStateChangeWatcher.saga)];
