import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { MyProfileHttpRequests } from '../http-requests';

export class ChangeUserOnlineStatus {
  static get action() {
    return createAction('CHANGE_ONLINE_STATUS')<boolean>();
  }

  static get saga() {
    return function* ({ payload }: ReturnType<typeof ChangeUserOnlineStatus.action>): SagaIterator {
      try {
        const httpRequest = MyProfileHttpRequests.changeOnlineStatus;
        httpRequest.call(yield call(() => httpRequest.generator({ isOnline: payload })));
      } catch (err) {
        alert(err);
      }
    };
  }
}
