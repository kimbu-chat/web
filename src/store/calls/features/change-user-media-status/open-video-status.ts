import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { ICallsState } from '../../calls-state';

export class OpenVideoStatus {
  static get action() {
    return createAction('OPEN_VIDEO_STATUS')<string | undefined>();
  }

  static get reducer() {
    return produce((draft: ICallsState, { payload }: ReturnType<typeof OpenVideoStatus.action>) => {
      if (payload) {
        draft.videoConstraints.deviceId = payload;
      }
      draft.videoConstraints.isOpened = true;
      return draft;
    });
  }
}
