import { createAction } from '@reduxjs/toolkit';

import { IUserSettings } from '../../user-settings-state';

export class TerminateSessionSuccess {
  static get action() {
    return createAction<number>('TERMINATE_SESSION_SUCCESS');
  }

  static get reducer() {
    return (
      draft: IUserSettings,
      { payload }: ReturnType<typeof TerminateSessionSuccess.action>,
    ) => {
      draft.sessionList.sessions = draft.sessionList.sessions.filter(({ id }) => id !== payload);
      return draft;
    };
  }
}
