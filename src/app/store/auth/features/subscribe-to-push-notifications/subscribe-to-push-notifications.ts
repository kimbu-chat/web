import { createEmptyAction } from 'app/store/common/actions';
import { authRequestFactory, HttpRequestMethod } from 'app/store/common/http';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { getPushNotificationTokens } from '../../common/utils';
import { ISubscribeToPushNotificationsApiRequest } from './api-requests/subscribe-to-push-notifications-api-request';

export class SubscribeToPushNotifications {
  static get action() {
    return createEmptyAction('SUBSCRIBE_TO_PUSH_NOTIFICATIONS');
  }

  static get saga() {
    return function* (): SagaIterator {
      const tokens = yield call(getPushNotificationTokens);
      if (tokens) {
        yield call(() => SubscribeToPushNotifications.httpRequest.generator(tokens));
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
