import { createAction } from '@reduxjs/toolkit';
import { ISession } from 'kimbu-models';

import { IUserSettings } from '../../user-settings-state';

export class GetSessionListSuccess {
  static get action() {
    return createAction<ISession[]>('GET_SESSION_LIST_SUCCESS');
  }

  static get reducer() {
    return (draft: IUserSettings, { payload }: ReturnType<typeof GetSessionListSuccess.action>) => {
        draft.sessionList.sessions = payload;
        draft.sessionList.isLoading = false;
        return draft;
      }
  }
}
