import { all, takeLatest, takeLeading } from 'redux-saga/effects';

import { Logout } from './features/logout/logout';
import { RefreshToken } from './features/refresh-token/refresh-token';
import { SubscribeToPushNotifications } from './features/subscribe-to-push-notifications/subscribe-to-push-notifications';
import { UnSubscribeFromPushNotifications } from './features/un-subscribe-from-push-notifications/un-subscribe-from-push-notifications';
import { RefreshTokenFailure } from './features/refresh-token/refresh-token-failure';
import { RefreshTokenSuccess } from './features/refresh-token/refresh-token-success';

export function* authSagas() {
  yield all([
    takeLatest(Logout.action, Logout.saga),
    takeLeading(RefreshToken.action, RefreshToken.saga),
    takeLeading(RefreshTokenFailure.action, RefreshTokenFailure.saga),
    takeLeading(RefreshTokenSuccess.action, RefreshTokenSuccess.saga),
    takeLatest(UnSubscribeFromPushNotifications.action, UnSubscribeFromPushNotifications.saga),
    takeLatest(SubscribeToPushNotifications.action, SubscribeToPushNotifications.saga),
  ]);
}
