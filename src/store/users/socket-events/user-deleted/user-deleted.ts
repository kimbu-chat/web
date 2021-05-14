import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { IUsersState } from '@store/users/users-state';
import { myIdSelector } from '@store/my-profile/selectors';

import { IUserDeletedActionPayload } from './action-payloads/user-deleted-action-payload';

export class UserDeletedEventHandler {
  static get action() {
    return createAction('UserDeleted')<IUserDeletedActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IUsersState, { payload }: ReturnType<typeof UserDeletedEventHandler.action>) => {
        const { userId } = payload;
        const user = draft.users[userId];

        if (user) {
          user.deleted = true;
        }

        return draft;
      },
    );
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
