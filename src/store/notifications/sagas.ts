import { all, takeLatest } from 'redux-saga/effects';

import { SubscribeToPushNotifications } from './features/subscribe-to-push-notifications/subscribe-to-push-notifications';
import { UnSubscribeFromPushNotifications } from './features/un-subscribe-from-push-notifications/un-subscribe-from-push-notifications';

export function* notificationsSagas() {
  yield all([
    takeLatest(UnSubscribeFromPushNotifications.action, UnSubscribeFromPushNotifications.saga),
    takeLatest(SubscribeToPushNotifications.action, SubscribeToPushNotifications.saga),
  ]);
}
