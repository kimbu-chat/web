import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import jwtDecode from 'jwt-decode';
import { ILoginRequest, ISecurityTokens } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, apply, put } from 'redux-saga/effects';

import { HTTPStatusCode } from '@common/http-status-code';
import { MAIN_API } from '@common/paths';
import { AuthService } from '@services/auth-service';
import { authRequestFactory, HttpRequestMethod } from '@store/common/http';

import { ILoginActionPayload } from './action-payloads/login-action-payload';
import { LoginSuccess } from './login-success';
import { ICustomJwtPayload } from './models/custom-jwt-payload';

export class Login {
  static get action() {
    return createAction<ILoginActionPayload>('LOGIN');
  }

  static get saga() {
    return function* login(action: ReturnType<typeof Login.action>): SagaIterator {
      const loginHttpRequest = Login.httpRequest;

      const { data, status } = loginHttpRequest.call(
        yield call(() => loginHttpRequest.generator(action.payload)),
      );

      if (status === HTTPStatusCode.OK && data.accessToken) {
        const decodedJwt = jwtDecode<ICustomJwtPayload>(data.accessToken);

        const deviceId = decodedJwt.refreshTokenId;

        const authService = new AuthService();

        yield apply(authService, authService.initialize, [data, deviceId]);

        yield put(LoginSuccess.action());
      }
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<ISecurityTokens>, ILoginRequest>(
      MAIN_API.TOKENS,
      HttpRequestMethod.Post,
    );
  }
}
