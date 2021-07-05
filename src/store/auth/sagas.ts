import { all, takeLatest, takeLeading } from 'redux-saga/effects';

import { RefreshToken } from '@store/auth/features/refresh-token/refresh-token';

import { Logout } from './features/logout/logout';
import { RefreshTokenSuccess } from './features/refresh-token/refresh-token-success';
import { SubscribeToPushNotifications } from './features/subscribe-to-push-notifications/subscribe-to-push-notifications';
import { UnSubscribeFromPushNotifications } from './features/un-subscribe-from-push-notifications/un-subscribe-from-push-notifications';

export function* authSagas() {
  yield all([
    takeLatest(Logout.action, Logout.saga),
    takeLeading(RefreshToken.action, RefreshToken.saga),
    takeLeading(RefreshTokenSuccess.action, RefreshTokenSuccess.saga),
    takeLatest(UnSubscribeFromPushNotifications.action, UnSubscribeFromPushNotifications.saga),
    takeLatest(SubscribeToPushNotifications.action, SubscribeToPushNotifications.saga),
  ]);
}
