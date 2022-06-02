import { createAction } from '@reduxjs/toolkit';
import merge from 'lodash/merge';

import { IUsersState } from '../../users-state';

import { IAddOrUpdateUsersActionPayload } from './action-payloads/add-or-update-users-action-payload.ts';

export class AddOrUpdateUsers {
  static get action() {
    return createAction<IAddOrUpdateUsersActionPayload>('UPDATE_USERS_LIST');
  }

  static get reducer() {
    return (draft: IUsersState, { payload }: ReturnType<typeof AddOrUpdateUsers.action>) => {
      const { users } = payload;

      draft.users = merge(draft.users, users);

      return draft;
    };
  }
}
