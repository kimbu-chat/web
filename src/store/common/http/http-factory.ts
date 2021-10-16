import axios, { AxiosError, CancelTokenSource } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, cancelled, put, take } from 'redux-saga/effects';

import { RefreshToken } from '@store/auth/features/refresh-token/refresh-token';
import { httpRequest } from '@store/common/http/http-request';
import { emitToast } from '@utils/emit-toast';

import { isNetworkError } from '../../../utils/error-utils';
import { RefreshTokenSuccess } from '../../auth/features/refresh-token/refresh-token-success';

import { checkTokensSaga } from './check-tokens';
import { getAuthHeader } from './common';
import { HttpRequestMethod } from './http-request-method';

import type { IRequestGenerator, UrlGenerator, HttpHeaders } from './types';

export const httpRequestFactory = <TResponse, TBody = unknown>(
  url: string | UrlGenerator<TBody>,
  method: HttpRequestMethod,
  headers?: HttpHeaders,
): IRequestGenerator<TResponse, TBody> => {
  function* generator(
    body?: TBody,
    assignCancelToken?: (token: CancelTokenSource) => void,
  ): SagaIterator {
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
        if (assignCancelToken) {
          assignCancelToken(cancelTokenSource);
        }
        return yield call(httpRequest, finalUrl, method, body, cancelTokenSource.token, {
          ...headers,
          ...authHeader,
        });
      } catch (e: any) {
        const error = e as AxiosError;

        emitToast(error.message, { type: 'error' });
        if (!isNetworkError(e) && error?.response?.status === 401) {
          yield put(RefreshToken.action());

          yield take(RefreshTokenSuccess.action);

          cancelTokenSource = axios.CancelToken.source();
          if (assignCancelToken) {
            assignCancelToken(cancelTokenSource);
          }
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
