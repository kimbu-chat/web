import produce from 'immer';
import { ISessionDto } from 'kimbu-models';
import { createAction } from 'typesafe-actions';

import { IUserSettings } from '../../user-settings-state';

export class GetSessionListSuccess {
  static get action() {
    return createAction('GET_SESSION_LIST_SUCCESS')<ISessionDto[]>();
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
