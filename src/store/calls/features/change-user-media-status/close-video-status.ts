import produce from 'immer';
import { createEmptyAction } from '@store/common/actions';
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
