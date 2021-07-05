import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IUserSettings } from '../../user-settings-state';

export class TerminateSessionSuccess {
  static get action() {
    return createAction('TERMINATE_SESSION_SUCCESS')<number>();
  }

  static get reducer() {
    return produce(
      (draft: IUserSettings, { payload }: ReturnType<typeof TerminateSessionSuccess.action>) => {
        draft.sessionList.sessions = draft.sessionList.sessions.filter(({ id }) => id !== payload);
        return draft;
      },
    );
  }
}
