import axios, { AxiosError, CancelTokenSource } from 'axios';
import { call, cancelled, put, select, take } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { RootState } from 'typesafe-actions';
import { ISecurityTokens } from '@store/auth/common/models/security-tokens';
import { securityTokensSelector } from '@store/auth/selectors';
import { isNetworkError } from '../../../utils/error-utils';
import { RefreshToken } from '../../auth/features/refresh-token/refresh-token';
import { RefreshTokenSuccess } from '../../auth/features/refresh-token/refresh-token-success';
import { HttpRequestMethod } from './http-request-method';
import { httpRequest } from './http-request';
import type { IRequestGenerator, UrlGenerator, HttpHeaders } from './types';

function* getAuthHeader(): SagaIterator {
  const securityTokens: ISecurityTokens = yield select(securityTokensSelector);

  return {
    authorization: `Bearer ${securityTokens.accessToken}`,
  };
}

export const httpRequestFactory = <TResponse, TBody = unknown>(
  url: string | UrlGenerator<TBody>,
  method: HttpRequestMethod,
  headers?: HttpHeaders,
): IRequestGenerator<TResponse, TBody> => {
  function* generator(body?: TBody): SagaIterator {
    let cancelTokenSource: CancelTokenSource | null = null;

    try {
      const refreshTokenRequestLoading = yield select(
        (rootState: RootState) => rootState.auth.refreshTokenRequestLoading,
      );

      if (refreshTokenRequestLoading) {
        yield take(RefreshTokenSuccess.action);
      }

      let finalUrl = url as string;

      if (body && typeof url === 'function') {
        finalUrl = (url as UrlGenerator<TBody>)(body);
      }

      try {
        const authHeader = yield call(getAuthHeader);
        cancelTokenSource = axios.CancelToken.source();
        return yield call(httpRequest, finalUrl, method, body, cancelTokenSource.token, {
          ...headers,
          ...authHeader,
        });
      } catch (e) {
        const error = e as AxiosError;
        if (!isNetworkError(e) && error?.response?.status === 401) {
          yield put(RefreshToken.action());
          yield take(RefreshTokenSuccess.action);
          cancelTokenSource = axios.CancelToken.source();
          const authHeader = yield call(getAuthHeader);
          return yield call(httpRequest, finalUrl, method, body, cancelTokenSource.token, {
            ...headers,
            ...authHeader,
          });
        }

        throw e;
      }
    } finally {
      if (yield cancelled()) {
        if (cancelTokenSource) {
          cancelTokenSource.cancel();
        }
      }
    }
  }

  return {
    generator,
    call: (a: TResponse): TResponse => a,
  };
};
