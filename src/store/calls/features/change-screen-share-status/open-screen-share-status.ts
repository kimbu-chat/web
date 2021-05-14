import produce from 'immer';

import { createEmptyAction } from '@store/common/actions';

import { ICallsState } from '../../calls-state';

export class OpenScreenShareStatus {
  static get action() {
    return createEmptyAction('OPEN_SCREEN_SHARE_STATUS');
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
      draft.isScreenSharingOpened = true;
      return draft;
    });
  }
}
