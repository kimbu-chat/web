import { createAction } from '@reduxjs/toolkit';

import { IUserSettings } from '../../user-settings-state';

export class UnblockUserSuccess {
  static get action() {
    return createAction<number>('UNBLOCK_USER_SUCCESS');
  }

  static get reducer() {
    return (draft: IUserSettings, { payload }: ReturnType<typeof UnblockUserSuccess.action>) => {
        draft.blackList.users = draft.blackList.users.filter(({ id }) => id !== payload);
        return draft;
      };
  }
}
