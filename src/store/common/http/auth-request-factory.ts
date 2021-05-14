import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { emitToast } from '@utils/emit-toast';

import { httpRequest } from './http-request';
import { HttpRequestMethod } from './http-request-method';
import type { IRequestGenerator, UrlGenerator } from './types';

export const authRequestFactory = <TResponse, TBody = unknown>(
  url: string | UrlGenerator<TBody>,
  method: HttpRequestMethod,
): IRequestGenerator<TResponse, TBody> => {
  function* generator(body?: TBody): SagaIterator {
    let finalUrl = url as string;

    if (body && typeof url === 'function') {
      finalUrl = (url as UrlGenerator<TBody>)(body);
    }

    try {
      return yield call(() => httpRequest(finalUrl, method, body));
    } catch (e) {
      emitToast(e.message, { type: 'error' });
      return undefined;
    }
  }

  return {
    generator,
    call: (a) => a,
  };
};
