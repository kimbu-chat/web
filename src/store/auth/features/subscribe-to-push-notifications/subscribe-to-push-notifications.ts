import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { authRequestFactory, HttpRequestMethod } from '@store/common/http';
import { createEmptyAction } from '@store/common/actions';
import { getPushNotificationToken } from '@store/auth/common/utils';
import { ISubscribeToPushNotificationsApiRequest } from './api-requests/subscribe-to-push-notifications-api-request';

export class SubscribeToPushNotifications {
  static get action() {
    return createEmptyAction('SUBSCRIBE_TO_PUSH_NOTIFICATIONS');
  }

  static get saga() {
    return function* subscribeToPushNotifications(): SagaIterator {
      const pushNotificationToken = yield call(getPushNotificationToken);
      if (pushNotificationToken) {
        yield call(() =>
          SubscribeToPushNotifications.httpRequest.generator({
            tokenId: pushNotificationToken,
          }));
      }
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse, ISubscribeToPushNotificationsApiRequest>(
      `${process.env.NOTIFICATIONS_API}/api/notifications/subscribe`,
      HttpRequestMethod.Post,
    );
  }
}
