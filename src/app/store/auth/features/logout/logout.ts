import { authRequestFactory, HttpRequestMethod } from 'app/store/common/http';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { createEmptyDefferedAction } from 'store/common/actions';
import { messaging } from 'store/middlewares/firebase/firebase';
import { getPushNotificationTokens } from '../../get-push-notification-tokens';
import { IAuthState } from '../../models';
import { IUnsubscribeFromPushNotificationsRequest } from './api-requests/unsubscribe-from-push-notifications-api-request';

export class Logout {
  static get action() {
    return createEmptyDefferedAction('LOGOUT');
  }

  static get reducer() {
    return produce((draft: IAuthState) => ({
      ...draft,
      loading: true,
    }));
  }

  static get saga() {
    return function* (action: ReturnType<typeof Logout.action>): SagaIterator {
      const tokens = yield call(getPushNotificationTokens);

      if (tokens) {
        yield call(() => Logout.httpRequest.generator(tokens));

        yield call(async () => await messaging?.deleteToken());
      }

      localStorage.clear();
      action?.meta.deferred.resolve();
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse, IUnsubscribeFromPushNotificationsRequest>(
      `${process.env.NOTIFICATIONS_API}/api/notifications/unsubscribe`,
      HttpRequestMethod.Post,
    );
  }
}
