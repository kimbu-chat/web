import axios, { AxiosError, AxiosRequestConfig, CancelToken, CancelTokenSource } from 'axios';
import { call, cancelled, put, select, take } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { isNetworkError } from 'app/utils/error-utils';
import { ISecurityTokens } from '../../auth/common/models';
import { securityTokensSelector } from '../../auth/selectors';
import { RefreshToken } from '../../auth/features/refresh-token/refresh-token';
import { RefreshTokenSuccess } from '../../auth/features/refresh-token/refresh-token-success';
import { retryOnNetworkConnectionError } from '../decorators/retry-on-network-connection-error';
import { RootState } from '../../root-reducer';
import { HttpRequestMethod } from './http-request-method';

type HttpHeaders = { [key: string]: string };

function* httpRequest<T>(url: string, method: HttpRequestMethod, body?: T, token?: CancelToken, headers?: HttpHeaders) {
  const requestConfig: AxiosRequestConfig = {
    url,
    method,
    cancelToken: token,
    responseType: 'json',
  };

  const securityTokens: ISecurityTokens = yield select(securityTokensSelector);

  if (securityTokens && securityTokens.accessToken) {
    requestConfig.headers = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bearer ${securityTokens.accessToken}`,
    };
  }

  if (headers != null) {
    Object.keys(headers).forEach((prop) => {
      requestConfig.headers[prop] = headers[prop];
    });
  }

  switch (method) {
    case HttpRequestMethod.Get:
      // requestConfig.params = body;
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

  const response = yield call(retryOnNetworkConnectionError, function* () {
    return yield call(retryOnNetworkConnectionError, function* () {
      return yield call(axios.create().request, requestConfig);
    });
  });

  return response;
}

interface IRequestGenerator<T, B> {
  generator: (body?: B) => SagaIterator;
  call: (args: any) => T;
}

type UrlGenerator<TBody> = (body: TBody) => string;

export const httpRequestFactory = <T, B = any>(url: string | UrlGenerator<B>, method: HttpRequestMethod, headers?: HttpHeaders): IRequestGenerator<T, B> => {
  function* generator(body?: B): SagaIterator {
    let cancelTokenSource: CancelTokenSource;

    try {
      const refreshTokenRequestLoading = yield select((rootState: RootState) => rootState.auth.refreshTokenRequestLoading);

      if (refreshTokenRequestLoading) {
        yield take(RefreshTokenSuccess.action);
      }

      const finalUrl: string = typeof url === 'function' ? (url as UrlGenerator<B>)(body!) : url;

      try {
        cancelTokenSource = axios.CancelToken.source();
        return yield call(httpRequest, finalUrl, method, body, cancelTokenSource.token, headers);
      } catch (e) {
        const error = e as AxiosError;
        if (!isNetworkError(e) && error?.response?.status === 401) {
          yield put(RefreshToken.action());
          yield take(RefreshTokenSuccess.action);
          cancelTokenSource = axios.CancelToken.source();
          return yield call(httpRequest, finalUrl, method, body, cancelTokenSource.token, headers);
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
    return yield call(() => httpRequest(url, method, body));
  }

  return {
    generator,
    call: (a) => a,
  };
};
