import { createAction } from '@reduxjs/toolkit';
import { IUser } from 'kimbu-models';

import { IUserSettings } from '../../user-settings-state';

export class GetBlackListSuccess {
  static get action() {
    return createAction<IUser[]>('GET_BLACK_LIST_SUCCESS');
  }

  static get reducer() {
    return (draft: IUserSettings, { payload }: ReturnType<typeof GetBlackListSuccess.action>) => {
      draft.blackList.users = payload;
      draft.blackList.isLoading = false;
      return draft;
    };
  }
}
