import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { ISession } from '../../comon/models/session';
import { IUserSettings } from '../../user-settings-state';

export class GetSessionListSuccess {
  static get action() {
    return createAction('GET_SESSION_LIST_SUCCESS')<ISession[]>();
  }

  static get reducer() {
    return produce(
      (draft: IUserSettings, { payload }: ReturnType<typeof GetSessionListSuccess.action>) => {
        draft.sessionList.sessions = payload;
        draft.sessionList.isLoading = false;
        return draft;
      },
    );
  }
}
