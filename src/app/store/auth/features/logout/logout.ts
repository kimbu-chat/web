import { AuthService } from 'app/services/auth-service';
import { MyProfileService } from 'app/services/my-profile-service';
import { authRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/models';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createEmptyAction } from '../../../common/actions';
import { messaging } from '../../../middlewares/firebase/firebase';
import { getPushNotificationTokens } from '../../get-push-notification-tokens';
import { AuthState, SubscribeToPushNotificationsRequest } from '../../models';
import { LogoutSuccess } from './logout-success';

export class Logout {
  static get action() {
    return createEmptyAction('LOGOUT');
  }

  static get reducer() {
    return produce((draft: AuthState) => ({
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
    return authRequestFactory<AxiosResponse, SubscribeToPushNotificationsRequest>(
      `${ApiBasePath.NotificationsApi}/api/notifications/unsubscribe`,
      HttpRequestMethod.Post,
    );
  }
}
