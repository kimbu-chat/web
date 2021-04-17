import { myIdSelector } from '@store/my-profile/selectors';
import { SagaIterator } from 'redux-saga';
import { select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IUserDeactivatedActionPayload } from './action-payloads/user-deactivated-action-payload';

export class UserDeactivatedEventHandler {
  static get action() {
    return createAction('UserDeactivated')<IUserDeactivatedActionPayload>();
  }

  static get saga() {
    return function* getMyProfile(
      action: ReturnType<typeof UserDeactivatedEventHandler.action>,
    ): SagaIterator {
      const currentUserId = yield select(myIdSelector);

      if (action.payload.userId === currentUserId) {
        window.location.replace('logout');
      }
    };
  }
}
