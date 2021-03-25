import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { httpRequest } from './http-request';
import { HttpRequestMethod } from './http-request-method';
import type { IRequestGenerator } from './types';

export const authRequestFactory = <T, B = unknown>(url: string, method: HttpRequestMethod): IRequestGenerator<T, B> => {
  function* generator(body?: B): SagaIterator {
    return yield call(() => httpRequest(url, method, body));
  }

  return {
    generator,
    call: (a) => a,
  };
};
