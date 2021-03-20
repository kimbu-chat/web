import produce from 'immer';
import { createEmptyAction } from '@store/common/actions';
import { ICallsState } from '../../calls-state';

export class OpenVideoStatus {
  static get action() {
    return createEmptyAction('OPEN_VIDEO_STATUS');
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
      draft.videoConstraints.isOpened = true;
      return draft;
    });
  }
}
