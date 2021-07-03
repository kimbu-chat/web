import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { NOTIFICATIONS_API } from '@common/paths';
import { getPushNotificationToken } from '@store/auth/common/utils';
import { createEmptyAction } from '@store/common/actions';
import { HttpRequestMethod, httpRequestFactory } from '@store/common/http';
import { messaging } from '@store/middlewares/firebase/firebase';

import { IUnsubscribeFromPushNotificationsRequest } from './api-requests/unsubscribe-from-push-notifications-api-request';
import { UnSubscribeToPushNotificationsSuccess } from './un-subscribe-from-push-notifications_success';

export class UnSubscribeFromPushNotifications {
  static get action() {
    return createEmptyAction('UN_SUBSCRIBE_FROM_PUSH_NOTIFICATIONS');
  }

  static get saga() {
    return function* unSubscribeFromPushNotifications(): SagaIterator {
      const pushNotificationToken = yield call(getPushNotificationToken);

      if (pushNotificationToken) {
        yield call(() =>
          UnSubscribeFromPushNotifications.httpRequest.generator({
            token: pushNotificationToken,
          }),
        );

        yield call(async () => messaging?.deleteToken());
      }

      yield put(UnSubscribeToPushNotificationsSuccess.action());
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IUnsubscribeFromPushNotificationsRequest>(
      NOTIFICATIONS_API.UNSUBSCRIBE,
      HttpRequestMethod.Post,
    );
  }
}
