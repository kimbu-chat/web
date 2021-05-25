import axios, { AxiosError, CancelTokenSource } from 'axios';
import { call, cancelled, put, select, take } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { RootState } from 'typesafe-actions';
import jwtDecode from 'jwt-decode';

import { ISecurityTokens } from '@store/auth/common/models/security-tokens';
import { securityTokensSelector } from '@store/auth/selectors';
import { ICustomJwtPayload } from '@store/login/features/login/models/custom-jwt-payload';
import { emitToast } from '@utils/emit-toast';

import { isNetworkError } from '../../../utils/error-utils';
import { RefreshToken } from '../../auth/features/refresh-token/refresh-token';
import { RefreshTokenSuccess } from '../../auth/features/refresh-token/refresh-token-success';

import { HttpRequestMethod } from './http-request-method';
import { httpRequest, requestTimeout } from './http-request';

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

      const securityTokens: ISecurityTokens = yield select(securityTokensSelector);

      const decodedJwt = jwtDecode<ICustomJwtPayload>(securityTokens.accessToken);

      if ((new Date().getTime() + (requestTimeout + 5000)) / 1000 > (decodedJwt?.exp || -1)) {
        yield put(RefreshToken.action());
        yield take(RefreshTokenSuccess.action);
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

        emitToast(error.message, { type: 'error' });
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
