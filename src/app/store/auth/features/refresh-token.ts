import { AuthService } from 'app/services/auth-service';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createEmptyAction } from '../../common/actions';
import { AuthHttpRequests } from '../http-requests';
import { LoginResponse } from '../models';
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
      const request = AuthHttpRequests.refreshToken;

      try {
        const { data }: AxiosResponse<LoginResponse> = yield call(() => request.generator({ refreshToken }));
        new AuthService().initialize(data);
        yield put(RefreshTokenSuccess.action(data));
      } catch (e) {
        yield put(RefreshTokenFailure.action());
      }
    };
  }
}
