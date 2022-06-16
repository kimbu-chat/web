import { createAction } from '@reduxjs/toolkit';

import { ICallsState } from '../../calls-state';

export class OpenScreenShareStatus {
  static get action() {
    return createAction('OPEN_SCREEN_SHARE_STATUS');
  }

  static get reducer() {
    return (draft: ICallsState) => {
      draft.isScreenSharingOpened = true;
      return draft;
    };
  }
}
