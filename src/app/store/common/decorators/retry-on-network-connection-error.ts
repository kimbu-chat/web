import { isNetworkError } from 'app/utils/error-utils';
import { call, race, take } from 'redux-saga/effects';
import { WebsocketsConnected } from 'app/store/internet/features/websockets-connection/websockets-connected';
import { InternetConnected } from '../../internet/features/internet-connection-check/internet-connected';

export function* retryOnNetworkConnectionError<TData>(handler: () => void) {
  while (true) {
    try {
      const data: TData = yield call(handler);
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
