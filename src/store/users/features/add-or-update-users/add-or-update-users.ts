import produce from 'immer';
import merge from 'lodash/merge';
import { createAction } from 'typesafe-actions';
import { IUsersState } from '../../users-state';
import { IAddOrUpdateUsersActionPayload } from './action-payloads/add-or-update-users-action-payload.ts';

export class AddOrUpdateUsers {
  static get action() {
    return createAction('UPDATE_USERS_LIST')<IAddOrUpdateUsersActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IUsersState, { payload }: ReturnType<typeof AddOrUpdateUsers.action>) => {
        const { users } = payload;

        draft.users = merge(draft.users, users);

        return draft;
      },
    );
  }
}
