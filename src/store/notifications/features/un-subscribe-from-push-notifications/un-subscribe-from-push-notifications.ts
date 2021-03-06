import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { HttpRequestMethod, httpRequestFactory } from '@store/common/http';
import { messaging } from '@store/middlewares/firebase/firebase';
import { getPushNotificationToken } from '@store/notifications/utils';

export class UnSubscribeFromPushNotifications {
  static get action() {
    return createAction('UN_SUBSCRIBE_FROM_PUSH_NOTIFICATIONS');
  }

  static get saga() {
    return function* unSubscribeFromPushNotifications(): SagaIterator {
      const pushNotificationToken = yield call(getPushNotificationToken);

      if (pushNotificationToken) {
        yield call(() => UnSubscribeFromPushNotifications.httpRequest.generator());

        yield call(async () => messaging?.deleteToken());
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse>(
      MAIN_API.UNSUBSCRIBE_FROM_PUSH_NOTIFICATIONS,
      HttpRequestMethod.Post,
    );
  }
}
