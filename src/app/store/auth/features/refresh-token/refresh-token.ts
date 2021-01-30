import { AuthService } from 'app/services/auth-service';
import { HttpRequestMethod, authRequestFactory } from 'app/store/common/http';

import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createEmptyAction } from 'store/common/actions';
import { IAuthState } from '../../auth-state';
import { IRefreshTokenApiRequest } from './api-requests/refresh-token-api-request';
import { IRefreshTokenApiResponse } from './api-requests/refresh-token-api-response';
import { RefreshTokenFailure } from './refresh-token-failure';
import { RefreshTokenSuccess } from './refresh-token-success';

export class RefreshToken {
  static get action() {
    return createEmptyAction('REFRESH_TOKEN');
  }

  static get reducer() {
    return produce((draft: IAuthState) => {
      draft.refreshTokenRequestLoading = true;
      return draft;
    });
  }

  static get saga() {
    return function* (): SagaIterator {
      const authService = new AuthService();

      const { refreshToken } = authService.securityTokens;

      try {
        const { httpRequest } = RefreshToken;
        const { data } = httpRequest.call(yield call(() => httpRequest.generator({ refreshToken })));
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
