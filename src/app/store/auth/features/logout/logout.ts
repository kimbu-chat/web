import { AuthService } from 'app/services/auth-service';
import { MyProfileService } from 'app/services/my-profile-service';
import { authRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/models';

import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createEmptyAction } from 'store/common/actions';
import { messaging } from 'store/middlewares/firebase/firebase';
import { getPushNotificationTokens } from '../../get-push-notification-tokens';
import { IAuthState } from '../../models';
import { IUnsubscribeFromPushNotificationsRequest } from './api-requests/unsubscribe-from-push-notifications-api-request';
import { LogoutSuccess } from './logout-success';

export class Logout {
  static get action() {
    return createEmptyAction('LOGOUT');
  }

  static get reducer() {
    return produce((draft: IAuthState) => ({
      ...draft,
      loading: true,
    }));
  }

  static get saga() {
    return function* (): SagaIterator {
      new AuthService().clear();
      new MyProfileService().clear();

      const tokens = yield call(getPushNotificationTokens);

      if (tokens) {
        yield call(() => Logout.httpRequest.generator(tokens));

        yield call(async () => await messaging.deleteToken());
      }

      yield put(LogoutSuccess.action());
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse, IUnsubscribeFromPushNotificationsRequest>(
      `${process.env.NOTIFICATIONS_API}/api/notifications/unsubscribe`,
      HttpRequestMethod.Post,
    );
  }
}
