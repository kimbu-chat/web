import { AxiosResponse } from 'axios';
import jwtDecode from 'jwt-decode';
import { SagaIterator } from 'redux-saga';
import { call, apply, put, spawn } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { HTTPStatusCode } from '@common/http-status-code';
import { MAIN_API } from '@common/paths';
import { AuthService } from '@services/auth-service';
import { authRequestFactory, HttpRequestMethod } from '@store/common/http';
import { messaging } from '@store/middlewares/firebase/firebase';
import { SubscribeToPushNotifications } from '@store/notifications/features/subscribe-to-push-notifications/subscribe-to-push-notifications';

import { ILoginActionPayload } from './action-payloads/login-action-payload';
import { ILoginApiRequest } from './api-requests/login-api-request';
import { ILoginApiResponse } from './api-requests/login-api-response';
import { LoginSuccess } from './login-success';
import { ICustomJwtPayload } from './models/custom-jwt-payload';

export class Login {
  static get action() {
    return createAction('LOGIN')<ILoginActionPayload>();
  }

  static get saga() {
    return function* login(action: ReturnType<typeof Login.action>): SagaIterator {
      const loginHttpRequest = Login.httpRequest;

      const { data, status } = loginHttpRequest.call(
        yield call(() => loginHttpRequest.generator(action.payload)),
      );

      if (status === HTTPStatusCode.OK) {
        yield call(async () => messaging?.deleteToken());

        const decodedJwt = jwtDecode<ICustomJwtPayload>(data.accessToken);

        const deviceId = decodedJwt.refreshTokenId;

        const authService = new AuthService();

        yield apply(authService, authService.initialize, [data, deviceId]);

        yield spawn(SubscribeToPushNotifications.saga);

        yield put(LoginSuccess.action());
      }
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<ILoginApiResponse>, ILoginApiRequest>(
      MAIN_API.TOKENS,
      HttpRequestMethod.Post,
    );
  }
}
