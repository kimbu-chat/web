import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { ICallState } from '../../models';

export class CloseScreenShareStatus {
  static get action() {
    return createEmptyAction('CLOSE_SCREEN_SHARE_STATUS');
  }

  static get reducer() {
    return produce((draft: ICallState) => {
      draft.isScreenSharingOpened = false;
      return draft;
    });
  }
}
