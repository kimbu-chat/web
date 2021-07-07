import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { NOTIFICATIONS_API } from '@common/paths';
import { createEmptyAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { getPushNotificationToken } from '@store/notifications/utils';

import type { ISubscribeToPushNotificationsApiRequest } from './api-requests/subscribe-to-push-notifications-api-request';

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
            token: pushNotificationToken,
          }),
        );
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, ISubscribeToPushNotificationsApiRequest>(
      NOTIFICATIONS_API.SUBSCRIBE,
      HttpRequestMethod.Post,
    );
  }
}
