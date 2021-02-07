import { createEmptyAction } from 'app/store/common/actions';
import { authRequestFactory, HttpRequestMethod } from 'app/store/common/http';
import { messaging } from 'app/store/middlewares/firebase/firebase';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { getPushNotificationToken } from '../../common/utils';
import { IUnsubscribeFromPushNotificationsRequest } from './api-requests/unsubscribe-from-push-notifications-api-request';
import { UnSubscribeToPushNotificationsSuccess } from './un-subscribe-from-push-notifications_success';

export class UnSubscribeFromPushNotifications {
  static get action() {
    return createEmptyAction('UN_SUBSCRIBE_FROM_PUSH_NOTIFICATIONS');
  }

  static get saga() {
    return function* (): SagaIterator {
      const pushNotificationToken = yield call(getPushNotificationToken);

      if (pushNotificationToken) {
        yield call(() => UnSubscribeFromPushNotifications.httpRequest.generator({ tokenId: pushNotificationToken }));

        yield call(async () => await messaging?.deleteToken());
      }

      yield put(UnSubscribeToPushNotificationsSuccess.action());
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse, IUnsubscribeFromPushNotificationsRequest>(
      `${process.env.NOTIFICATIONS_API}/api/notifications/unsubscribe`,
      HttpRequestMethod.Post,
    );
  }
}
