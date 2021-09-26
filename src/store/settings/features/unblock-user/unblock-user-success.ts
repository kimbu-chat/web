import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IUserSettings } from '../../user-settings-state';

export class UnblockUserSuccess {
  static get action() {
    return createAction('UNBLOCK_USER_SUCCESS')<number>();
  }

  static get reducer() {
    return produce(
      (draft: IUserSettings, { payload }: ReturnType<typeof UnblockUserSuccess.action>) => {
        draft.blackList.users = draft.blackList.users.filter(({ id }) => id !== payload);
        return draft;
      },
    );
  }
}
