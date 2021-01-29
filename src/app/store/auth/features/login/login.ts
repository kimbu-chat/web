import { authRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod, IUserPreview } from 'app/store/models';
import { GetMyProfileSuccess } from 'app/store/my-profile/features/get-my-profile/get-my-profile-success';
import { AxiosResponse } from 'axios';
import jwt_decode from 'jwt-decode';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { Init } from 'app/store/initiation/features/init/init';
import { getPushNotificationTokens } from '../../get-push-notification-tokens';
import { ISecurityTokens } from '../../models';
import { ILoginApiRequest } from './api-requests/login-api-request';
import { ILoginApiResponse } from './api-requests/login-api-response';
import { ILoginActionPayload } from './action-payloads/login-action-payload';
import { LoginSuccess } from './login-success';
import { ICustomJwtPayload } from './models/custom-jwt-payload';
import { ISubscribeToPushNotificationsApiRequest } from './api-requests/subscribe-to-push-notifications-api-request';

export class Login {
  static get action() {
    return createAction('LOGIN')<ILoginActionPayload>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof Login.action>): SagaIterator {
      const loginHttpRequest = Login.httpRequest;

      const { data } = loginHttpRequest.call(yield call(() => loginHttpRequest.generator(action.payload)));
      const userProfile: IUserPreview = JSON.parse(jwt_decode<ICustomJwtPayload>(data.accessToken).profile);
      yield put(GetMyProfileSuccess.action(userProfile));

      const securityTokens: ISecurityTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        refreshTokenExpirationTime: data.refreshTokenExpirationTime,
      };
      yield put(LoginSuccess.action(securityTokens));

      const tokens = yield call(getPushNotificationTokens);
      if (tokens) {
        const subscribeToPushNotificationsHttpRequest = authRequestFactory<AxiosResponse, ISubscribeToPushNotificationsApiRequest>(
          `${process.env.NOTIFICATIONS_API}/api/notifications/subscribe`,
          HttpRequestMethod.Post,
        );

        yield call(() => subscribeToPushNotificationsHttpRequest.generator(tokens));
      }

      yield put(Init.action());
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<ILoginApiResponse>, ILoginApiRequest>(`${process.env.MAIN_API}/api/users/tokens`, HttpRequestMethod.Post);
  }
}
