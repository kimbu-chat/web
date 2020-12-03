import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { delay, put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IInternetState, InternetState } from '../models';

export class InternetConnectionCheck {
  static get action() {
    return createAction('INTERNET_CONNECTION_CHECK')<IInternetState>();
  }

  static get reducer() {
    return produce((draft: InternetState, { payload }: ReturnType<typeof InternetConnectionCheck.action>) => {
      draft.isInternetConnected = payload.state;
      return draft;
    });
  }

  static get saga() {
    return function* intervalInternetConnectionCheckSaga(): SagaIterator {
      const ping = (): Promise<boolean> =>
        new Promise((resolve) => {
          const isOnline = () => resolve(true);
          const isOffline = () => resolve(false);

          fetch(`/file-for-ping.txt?d=${Date.now()}`)
            .then((response) => {
              if (response.ok) {
                isOnline();
              } else {
                isOffline();
              }
            })
            .catch(isOffline);
        });

      while (true) {
        yield delay(10000);
        const internetState = yield call(ping);
        yield put(InternetConnectionCheck.action({ state: internetState }));
      }
    };
  }
}
