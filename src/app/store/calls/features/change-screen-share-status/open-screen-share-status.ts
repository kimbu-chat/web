import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { ICallState } from '../../models';

export class OpenScreenShareStatus {
  static get action() {
    return createEmptyAction('OPEN_SCREEN_SHARE_STATUS');
  }

  static get reducer() {
    return produce((draft: ICallState) => {
      draft.isScreenSharingOpened = true;
      return draft;
    });
  }
}
