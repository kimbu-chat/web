import { createAction } from '@reduxjs/toolkit';

import { ICallsState } from '../../calls-state';

export class CloseVideoStatus {
  static get action() {
    return createAction('CLOSE_VIDEO_STATUS');
  }

  static get reducer() {
    return (draft: ICallsState) => {
      draft.videoConstraints.isOpened = false;
      return draft;
    };
  }
}
