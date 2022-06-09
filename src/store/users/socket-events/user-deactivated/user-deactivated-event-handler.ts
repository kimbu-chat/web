import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';

import { myIdSelector } from '@store/my-profile/selectors';
import { IUsersState } from '@store/users/users-state';

import { Logout } from '../../../auth/features/logout/logout';

import { IUserDeactivatedActionPayload } from './action-payloads/user-deactivated-action-payload';

export class UserDeactivatedEventHandler {
  static get action() {
    return createAction<IUserDeactivatedActionPayload>('UserDeactivated');
  }

  static get reducer() {
    return (
      draft: IUsersState,
      { payload }: ReturnType<typeof UserDeactivatedEventHandler.action>,
    ) => {
      const { userId } = payload;
      const user = draft.users[userId];

      if (user) {
        user.deactivated = true;
      }

      return draft;
    };
  }

  static get saga() {
    return function* userDeactivatedSaga(
      action: ReturnType<typeof UserDeactivatedEventHandler.action>,
    ): SagaIterator {
      const currentUserId = yield select(myIdSelector);

      if (action.payload.userId === currentUserId) {
        yield call(Logout.saga);
      }
    };
  }
}
