import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { HttpRequestMethod } from '@store/common/http/http-request-method';
import { authRequestFactory } from '@store/common/http/auth-request-factory';
import { createEmptyAction } from '@store/common/actions';
import { IAuthState } from '../../auth-state';
import { ISecurityTokens } from '../../common/models';
import { securityTokensSelector } from '../../selectors';
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
    return function* refToken(): SagaIterator {
      const { refreshToken }: ISecurityTokens = yield select(securityTokensSelector);

      try {
        const { httpRequest } = RefreshToken;
        const { data } = httpRequest.call(
          yield call(() => httpRequest.generator({ refreshToken })),
        );
        yield put(RefreshTokenSuccess.action(data));
      } catch (e) {
        yield put(RefreshTokenFailure.action());
      }
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<IRefreshTokenApiResponse>, IRefreshTokenApiRequest>(
      `${process.env.REACT_APP_MAIN_API}/api/users/refresh-tokens`,
      HttpRequestMethod.Post,
    );
  }
}
