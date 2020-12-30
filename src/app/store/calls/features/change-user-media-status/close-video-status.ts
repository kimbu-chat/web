import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { ICallState } from '../../models';

export class CloseVideoStatus {
  static get action() {
    return createEmptyAction('CLOSE_VIDEO_STATUS');
  }

  static get reducer() {
    return produce((draft: ICallState) => {
      draft.videoConstraints.isOpened = false;
      return draft;
    });
  }
}
