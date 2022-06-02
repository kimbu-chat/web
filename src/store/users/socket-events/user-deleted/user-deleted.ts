import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { select, call } from 'redux-saga/effects';

import { myIdSelector } from '@store/my-profile/selectors';
import { IUsersState } from '@store/users/users-state';

import { Logout } from '../../../auth/features/logout/logout';

import { IUserDeletedActionPayload } from './action-payloads/user-deleted-action-payload';

export class UserDeletedEventHandler {
  static get action() {
    return createAction<IUserDeletedActionPayload>('UserDeleted');
  }

  static get reducer() {
    return (draft: IUsersState, { payload }: ReturnType<typeof UserDeletedEventHandler.action>) => {
        const { userId } = payload;
        const user = draft.users[userId];

        if (user) {
          user.deleted = true;
        }

        return draft;
      }
  }

  static get saga() {
    return function* userDeletedSaga(
      action: ReturnType<typeof UserDeletedEventHandler.action>,
    ): SagaIterator {
      const currentUserId = yield select(myIdSelector);

      if (action.payload.userId === currentUserId) {
        yield call(Logout.saga);
      }
    };
  }
}
