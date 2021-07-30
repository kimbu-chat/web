import { all, takeLeading, takeEvery } from 'redux-saga/effects';

import { Logout } from './features/logout/logout';
import { RefreshTokenFailure } from './features/refresh-token/refresh-token-failure';
import { RefreshTokenSuccess } from './features/refresh-token/refresh-token-success';
import { RefreshToken } from './features/refresh-token/refresh-token';
import { SessionTerminatedEventHandler } from './socket-events/session-terminated/session-terminated-event-handler';

export function* authSagas() {
  yield all([
    takeLeading(Logout.action, Logout.saga),
    takeLeading(RefreshToken.action, RefreshToken.saga),
    takeLeading(RefreshTokenSuccess.action, RefreshTokenSuccess.saga),
    takeLeading(RefreshTokenFailure.action, RefreshTokenFailure.saga),
    takeEvery(SessionTerminatedEventHandler.action, SessionTerminatedEventHandler.saga),
  ]);
}
