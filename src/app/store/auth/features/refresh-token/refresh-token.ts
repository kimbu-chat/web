import { AuthService } from 'app/services/auth-service';
import { authRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/models';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createEmptyAction } from 'store/common/actions';
import { IRefreshTokenApiRequest } from './api-requests/refresh-token-api-request';
import { IRefreshTokenApiResponse } from './api-requests/refresh-token-api-response';
import { RefreshTokenFailure } from './refresh-token-failure';
import { RefreshTokenSuccess } from './refresh-token-success';

export class RefreshToken {
  static get action() {
    return createEmptyAction('REFRESH_TOKEN');
  }

  static get saga() {
    return function* (): SagaIterator {
      const authService = new AuthService();

      const { refreshToken } = authService.securityTokens;

      try {
        const { data }: AxiosResponse<IRefreshTokenApiResponse> = yield call(() => RefreshToken.httpRequest.generator({ refreshToken }));
        new AuthService().initialize(data);
        yield put(RefreshTokenSuccess.action(data));
      } catch (e) {
        yield put(RefreshTokenFailure.action());
      }
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<IRefreshTokenApiResponse>, IRefreshTokenApiRequest>(
      `${process.env.MAIN_API}/api/users/refresh-tokens`,
      HttpRequestMethod.Post,
    );
  }
}
