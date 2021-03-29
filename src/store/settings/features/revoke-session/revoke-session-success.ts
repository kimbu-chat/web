import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IUserSettings } from '../../user-settings-state';

export class RevokeSessionSuccess {
  static get action() {
    return createAction('REVOKE_SESSION_SUCCESS')<number>();
  }

  static get reducer() {
    return produce((draft: IUserSettings, { payload }: ReturnType<typeof RevokeSessionSuccess.action>) => {
      draft.sessionList.sessions = draft.sessionList.sessions.filter(({ id }) => id !== payload);
      return draft;
    });
  }
}
