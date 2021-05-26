import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { HttpRequestMethod } from '@store/common/http/http-request-method';
import { authRequestFactory } from '@store/common/http/auth-request-factory';
import { createEmptyAction } from '@store/common/actions';
import { MAIN_API } from '@common/paths';
import { getAccessTokenExpirationTime } from '@utils/get-access-token-expiration-time';

import { IAuthState } from '../../auth-state';
import { ISecurityTokens } from '../../common/models';
import { securityTokensSelector } from '../../selectors';

import { IRefreshTokenApiRequest } from './api-requests/refresh-token-api-request';
import { IRefreshTokenApiResponse } from './api-requests/refresh-token-api-response';
import { RefreshTokenFailure } from './refresh-token-failure';
import { RefreshTokenSuccess } from './refresh-token-success';
import { IRefreshTokenSuccessActionPayload } from './action-payloads/refresh-token-success-action-payload';

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

        const refreshTokenActionPayload: IRefreshTokenSuccessActionPayload = {
          ...data,
          accessTokenExpirationTime: getAccessTokenExpirationTime(data.accessToken),
        };

        yield put(RefreshTokenSuccess.action(refreshTokenActionPayload));
      } catch (e) {
        yield put(RefreshTokenFailure.action());
      }
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<IRefreshTokenApiResponse>, IRefreshTokenApiRequest>(
      MAIN_API.REFRESH_TOKENS,
      HttpRequestMethod.Post,
    );
  }
}
