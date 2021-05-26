import { AxiosResponse } from 'axios';
import jwtDecode from 'jwt-decode';
import { SagaIterator } from 'redux-saga';
import { call, apply, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { authRequestFactory, HttpRequestMethod } from '@store/common/http';
import { MAIN_API } from '@common/paths';
import { AuthService } from '@services/auth-service';
import { ISecurityTokens } from '@store/auth/common/models';
import { getAccessTokenExpirationTime } from '@utils/get-access-token-expiration-time';

import { ILoginApiRequest } from './api-requests/login-api-request';
import { ILoginApiResponse } from './api-requests/login-api-response';
import { ILoginActionPayload } from './action-payloads/login-action-payload';
import { ICustomJwtPayload } from './models/custom-jwt-payload';
import { LoginSuccess } from './login-success';

export class Login {
  static get action() {
    return createAction('LOGIN')<ILoginActionPayload>();
  }

  static get saga() {
    return function* login(action: ReturnType<typeof Login.action>): SagaIterator {
      const loginHttpRequest = Login.httpRequest;

      const { data } = loginHttpRequest.call(
        yield call(() => loginHttpRequest.generator(action.payload)),
      );

      const decodedJwt = jwtDecode<ICustomJwtPayload>(data.accessToken);

      const deviceId = decodedJwt.refreshTokenId;

      const authService = new AuthService();

      const securityTokens: ISecurityTokens = {
        ...data,
        ...{ accessTokenExpirationTime: getAccessTokenExpirationTime(data.accessToken) },
      };

      yield apply(authService, authService.initialize, [securityTokens, deviceId]);

      yield put(LoginSuccess.action());
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<ILoginApiResponse>, ILoginApiRequest>(
      MAIN_API.TOKENS,
      HttpRequestMethod.Post,
    );
  }
}
