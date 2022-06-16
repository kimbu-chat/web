import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { IRefreshTokenRequest, ISecurityTokens } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { HTTPStatusCode } from '@common/http-status-code';
import { MAIN_API } from '@common/paths';
import { authRequestFactory } from '@store/common/http/auth-request-factory';
import { getAuthHeader } from '@store/common/http/common';
import { HttpRequestMethod } from '@store/common/http/http-request-method';
import { getAccessTokenExpirationTime } from '@utils/get-access-token-expiration-time';

import { IAuthState } from '../../auth-state';
import { securityTokensSelector } from '../../selectors';

import { RefreshTokenFailure } from './refresh-token-failure';
import { IRefreshTokenSuccessActionPayload, RefreshTokenSuccess } from './refresh-token-success';

export class RefreshToken {
  static get action() {
    return createAction('REFRESH_TOKEN');
  }

  static get reducer() {
    return (draft: IAuthState) => {
      draft.refreshTokenRequestLoading = true;
      return draft;
    };
  }

  static get saga() {
    return function* refreshTokenSaga(): SagaIterator {
      const { refreshToken }: ISecurityTokens = yield select(securityTokensSelector);
      if (!refreshToken) {
        return;
      }

      const authHeader = yield call(getAuthHeader);

      const httpRequest = authRequestFactory<AxiosResponse<ISecurityTokens>, IRefreshTokenRequest>(
        MAIN_API.REFRESH_TOKENS,
        HttpRequestMethod.Post,
        authHeader,
      );

      const response = httpRequest.call(yield call(() => httpRequest.generator({ refreshToken })));

      if (response?.status !== HTTPStatusCode.OK) {
        yield put(RefreshTokenFailure.action());
      }

      if (response?.data.accessToken) {
        const refreshTokenActionPayload: IRefreshTokenSuccessActionPayload = {
          ...response?.data,
          accessTokenExpirationTime: getAccessTokenExpirationTime(response?.data.accessToken),
        };

        yield put(RefreshTokenSuccess.action(refreshTokenActionPayload));
      }
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<ISecurityTokens>, IRefreshTokenRequest>(
      MAIN_API.REFRESH_TOKENS,
      HttpRequestMethod.Post,
    );
  }
}
