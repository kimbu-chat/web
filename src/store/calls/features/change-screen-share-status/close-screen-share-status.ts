import { createAction } from '@reduxjs/toolkit';

import { ICallsState } from '../../calls-state';

export class CloseScreenShareStatus {
  static get action() {
    return createAction('CLOSE_SCREEN_SHARE_STATUS');
  }

  static get reducer() {
    return (draft: ICallsState) => {
      draft.isScreenSharingOpened = false;
      return draft;
    };
  }
}
