import { all, takeLatest, takeLeading } from 'redux-saga/effects';

import { Logout } from './features/logout/logout';
import { RefreshTokenFailure } from './features/refresh-token/refresh-token-failure';
import { RefreshTokenSuccess } from './features/refresh-token/refresh-token-success';
import { RefreshToken } from './features/refresh-token/refresh-token';

export function* authSagas() {
  yield all([
    takeLatest(Logout.action, Logout.saga),
    takeLeading(RefreshToken.action, RefreshToken.saga),
    takeLeading(RefreshTokenFailure.action, RefreshTokenFailure.saga),
    takeLeading(RefreshTokenSuccess.action, RefreshTokenSuccess.saga),
  ]);
}
