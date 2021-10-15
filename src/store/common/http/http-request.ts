import axios, { AxiosRequestConfig, CancelToken } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { retryOnNetworkConnectionError } from './decorators/retry-on-network-connection-error';
import { HttpRequestMethod } from './http-request-method';

import type { HttpHeaders } from './types';

export function* httpRequest<TBody>(
  url: string,
  method: HttpRequestMethod,
  body?: TBody,
  token?: CancelToken,
  headers?: HttpHeaders,
): SagaIterator {
  const requestConfig: AxiosRequestConfig = {
    url,
    method,
    cancelToken: token,
    responseType: 'json',
  };

  if (headers != null) {
    requestConfig.headers = headers;
  }

  switch (method) {
    case HttpRequestMethod.Get:
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

  return yield call(retryOnNetworkConnectionError, function* retry() {
    try {
      return yield call(axios.create().request, requestConfig);
    } catch (e) {
      if (e.message) {
        // If request was canceled e.message is undefined and we have not to handle thid error
        throw e;
      }
    }

    return undefined;
  });
}
