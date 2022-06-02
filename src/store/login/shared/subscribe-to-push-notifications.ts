import { SagaIterator } from 'redux-saga';
import { spawn, call } from 'redux-saga/effects';

export function* subscribeToPushNotifications(): SagaIterator {
  const { messaging } = yield call(() => import('@store/middlewares/firebase/firebase'));

  yield call(async () => messaging?.deleteToken());

  const { SubscribeToPushNotifications } = yield call(
    () =>
      import(
        '@store/notifications/features/subscribe-to-push-notifications/subscribe-to-push-notifications'
      ),
  );
  yield spawn(SubscribeToPushNotifications.saga);
}
