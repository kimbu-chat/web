import produce from 'immer';

import { createEmptyAction } from '@store/common/actions';

import { ICallsState } from '../../calls-state';

export class CloseScreenShareStatus {
  static get action() {
    return createEmptyAction('CLOSE_SCREEN_SHARE_STATUS');
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
      draft.isScreenSharingOpened = false;
      return draft;
    });
  }
}
