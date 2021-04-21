import { myIdSelector } from '@store/my-profile/selectors';
import { SagaIterator } from 'redux-saga';
import { select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IUserDeletedActionPayload } from './action-payloads/user-deleted-action-payload';

export class UserDeletedEventHandler {
  static get action() {
    return createAction('UserDeleted')<IUserDeletedActionPayload>();
  }

  static get saga() {
    return function* userDeletedSaga(
      action: ReturnType<typeof UserDeletedEventHandler.action>,
    ): SagaIterator {
      const currentUserId = yield select(myIdSelector);

      if (action.payload.userId === currentUserId) {
        window.location.replace('logout');
      }
    };
  }
}
