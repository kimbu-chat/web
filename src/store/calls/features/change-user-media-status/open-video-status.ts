import { createAction } from '@reduxjs/toolkit';

import { ICallsState } from '../../calls-state';

export class OpenVideoStatus {
  static get action() {
    return createAction<string | undefined>('OPEN_VIDEO_STATUS');
  }

  static get reducer() {
    return (draft: ICallsState, { payload }: ReturnType<typeof OpenVideoStatus.action>) => {
      if (payload) {
        draft.videoConstraints.deviceId = payload;
      }
      draft.videoConstraints.isOpened = true;
      return draft;
    };
  }
}
