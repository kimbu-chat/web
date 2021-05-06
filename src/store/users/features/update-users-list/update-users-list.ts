import produce from 'immer';
import { merge } from 'lodash';
import { createAction } from 'typesafe-actions';
import { IUsersState } from '../../users-state';
import { IUpdateUsersListActionPayload } from './action-payloads/update-users-list-action-payload';

export class UpdateUsersList {
  static get action() {
    return createAction('UPDATE_USERS_LIST')<IUpdateUsersListActionPayload>();
  }

  static get reducer() {
    return produce((draft: IUsersState, { payload }: ReturnType<typeof UpdateUsersList.action>) => {
      const { users } = payload;

      draft.users = merge(draft.users, users);

      return draft;
    });
  }
}
