import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { ICallsState } from '../../calls-state';

export class CloseVideoStatus {
  static get action() {
    return createEmptyAction('CLOSE_VIDEO_STATUS');
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
      draft.videoConstraints.isOpened = false;
      return draft;
    });
  }
}
