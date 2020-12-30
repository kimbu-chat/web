import { AuthService } from 'app/services/auth-service';
import { authRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/models';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createEmptyAction } from 'store/common/actions';
import { ILoginResponse } from '../../models';
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
        const { data }: AxiosResponse<ILoginResponse> = yield call(() => RefreshToken.httpRequest.generator({ refreshToken }));
        new AuthService().initialize(data);
        yield put(RefreshTokenSuccess.action(data));
      } catch (e) {
        yield put(RefreshTokenFailure.action());
      }
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<ILoginResponse>, { refreshToken: string }>(
      `${ApiBasePath.MainApi}/api/users/refresh-tokens`,
      HttpRequestMethod.Post,
    );
  }
}
