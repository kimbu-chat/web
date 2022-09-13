import { AxiosError } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, race, take } from 'redux-saga/effects';

import { WebsocketsConnected } from '@store/internet/features/websockets-connection/websockets-connected';
import { isNetworkError } from '@utils/error-utils';

import { InternetConnected } from '../../internet/features/internet-connection-check/internet-connected';

export function* retryOnNetworkConnectionError(handler: () => SagaIterator): SagaIterator {
  while (true) {
    try {
      return yield call(handler);
    } catch (e) {
      if (e instanceof AxiosError) {
        if (isNetworkError(e)) {
          yield race({
            websocketsConnected: take(WebsocketsConnected.action),
            internetConnected: take(InternetConnected.action),
          });
        } else {
          throw e;
        }
      }
    }
  }
}
