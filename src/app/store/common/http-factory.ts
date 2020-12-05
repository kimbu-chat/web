import axios, { AxiosError, AxiosRequestConfig, CancelToken, CancelTokenSource } from 'axios';
import { call, cancelled, put, select, take } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { isNetworkError } from 'utils/functions/error-utils';
import { SecurityTokens } from '../auth/models';
import { selectSecurityTokens } from '../auth/selectors';
import { RefreshToken } from '../auth/features/refresh-token/refresh-token';
import { RefreshTokenSuccess } from '../auth/features/refresh-token/refresh-token-success';

export enum HttpRequestMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

export type HttpHeaders = { [key: string]: string };

export function* httpRequest<T>(url: string, method: HttpRequestMethod, body?: T, token?: CancelToken, headers?: HttpHeaders) {
  const requestConfig: AxiosRequestConfig = {
    url,
    method,
    cancelToken: token,
    responseType: 'json',
  };

  const auth: SecurityTokens = yield select(selectSecurityTokens);

  if (auth && auth.accessToken) {
    requestConfig.headers = {
      Authorization: `Bearer ${auth.accessToken}`,
    };
  }

  if (headers != null) {
    Object.keys(headers).forEach((prop) => {
      requestConfig.headers[prop] = headers[prop];
    });
  }

  switch (method) {
    case HttpRequestMethod.Get:
      requestConfig.params = body;
      break;
    case HttpRequestMethod.Post:
      requestConfig.data = body;
      break;
    case HttpRequestMethod.Put:
      requestConfig.data = body;
      break;
    case HttpRequestMethod.Delete:
      requestConfig.params = body;
      break;
    default:
      throw new Error('Unknown method.');
  }

  const response = yield call(axios.create().request, requestConfig);
  return response;
}

export interface IRequestGenerator<T, B> {
  generator: (body?: B) => SagaIterator;
  call: (args: any) => T;
}

type UrlGenerator<TBody> = (body: TBody) => string;

export const httpRequestFactory = <T, B>(url: string | UrlGenerator<B>, method: HttpRequestMethod, headers?: HttpHeaders): IRequestGenerator<T, B> => {
  function* generator(body?: B): SagaIterator {
    let cancelTokenSource: CancelTokenSource;

    try {
      let auth: SecurityTokens = yield select(selectSecurityTokens);

      if (auth?.refreshTokenRequestLoading) {
        yield take(RefreshTokenSuccess.action);
      }

      const finalUrl: string = typeof url === 'function' ? (url as UrlGenerator<B>)(body!) : url;

      try {
        cancelTokenSource = axios.CancelToken.source();
        return yield call(httpRequest, finalUrl, method, body, cancelTokenSource.token, headers);
      } catch (e) {
        const error = e as AxiosError;
        if (isNetworkError(e)) {
          alert('Network Error.');
        } else if (error?.response?.status === 401) {
          yield put(RefreshToken.action());

          yield take(RefreshTokenSuccess.action);

          auth = yield select(selectSecurityTokens);

          if (auth.isAuthenticated) {
            cancelTokenSource = axios.CancelToken.source();
            return yield call(httpRequest, finalUrl, method, body, cancelTokenSource.token, headers);
          }
        }

        throw e;
      }
    } finally {
      if (yield cancelled()) {
        if (cancelTokenSource!) {
          cancelTokenSource!.cancel();
        }
      }
    }
  }

  return {
    generator,
    call: (a) => a,
  };
};

export const authRequestFactory = <T, B>(url: string, method: HttpRequestMethod): IRequestGenerator<T, B> => {
  function* generator(body?: B): SagaIterator {
    try {
      return yield call(() => httpRequest(url, method, body));
    } catch (e) {
      const error = e as AxiosError;

      if (isNetworkError(error)) {
        alert('Network Error.');
      }
    }
    return false;
  }

  return {
    generator,
    call: (a) => a,
  };
};
