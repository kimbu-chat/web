import axios, { AxiosError, CancelTokenSource } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, cancelled, put, select, take } from 'redux-saga/effects';

import { RefreshToken } from '@store/auth/features/refresh-token/refresh-token';
import { securityTokensSelector } from '@store/auth/selectors';
import { httpRequest } from '@store/common/http/http-request';
import { emitToast } from '@utils/emit-toast';

import { isNetworkError } from '../../../utils/error-utils';
import { RefreshTokenSuccess } from '../../auth/features/refresh-token/refresh-token-success';

import { checkTokensSaga } from './check-tokens';
import { HttpRequestMethod } from './http-request-method';

import type { IRequestGenerator, UrlGenerator, HttpHeaders } from './types';
import type { ISecurityTokens } from 'kimbu-models';

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
      let finalUrl = url as string;

      if (body && typeof url === 'function') {
        finalUrl = (url as UrlGenerator<TBody>)(body);
      }

      yield call(checkTokensSaga);

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
