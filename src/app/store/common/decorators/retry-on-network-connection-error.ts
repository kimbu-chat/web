import { isNetworkError } from 'app/utils/error-utils';

export function retryOnNetworkConnectionError() {
  return function* (handler: () => any) {
    while (true) {
      try {
        yield* handler();
        break;
      } catch (e) {
        if (isNetworkError(e)) {
          /// yield take(websocketConnected);
        } else {
          throw e;
        }
      }
    }
  };
}
