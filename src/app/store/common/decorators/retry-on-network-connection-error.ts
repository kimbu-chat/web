import { isNetworkError } from 'app/utils/error-utils';
import { call, race, take } from 'redux-saga/effects';
import { WebsocketsConnected } from 'app/store/internet/features/websockets-connection/websockets-connected';
import { SagaIterator } from 'redux-saga';
import { InternetConnected } from '../../internet/features/internet-connection-check/internet-connected';

export function* retryOnNetworkConnectionError<TResponse>(handler: () => SagaIterator): SagaIterator {
  while (true) {
    try {
      const data: TResponse = yield call(handler);
      return data;
    } catch (e) {
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
