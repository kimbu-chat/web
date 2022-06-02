import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { ISubscribeToPushNotificationsRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { getPushNotificationToken } from '@store/notifications/utils';

export class SubscribeToPushNotifications {
  static get action() {
    return createAction('SUBSCRIBE_TO_PUSH_NOTIFICATIONS');
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
    return httpRequestFactory<AxiosResponse, ISubscribeToPushNotificationsRequest>(
      MAIN_API.SUBSCRIBE_TO_PUSH_NOTIFICATIONS,
      HttpRequestMethod.Post,
    );
  }
}
