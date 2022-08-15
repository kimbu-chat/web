import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { httpRequest } from './http-request';
import { HttpRequestMethod } from './http-request-method';

import type { HttpHeaders, IRequestGenerator, UrlGenerator } from './types';

export const authRequestFactory = <TResponse, TBody = unknown>(
  url: string | UrlGenerator<TBody>,
  method: HttpRequestMethod,
  headers?: HttpHeaders,
): IRequestGenerator<TResponse, TBody> => {
  function* generator(body?: TBody): SagaIterator {
    let finalUrl = url as string;

    if (body && typeof url === 'function') {
      finalUrl = (url as UrlGenerator<TBody>)(body);
    }

    return yield call(() => httpRequest(finalUrl, method, body, undefined, headers));
  }

  return {
    generator,
    call: (a) => a,
  };
};
