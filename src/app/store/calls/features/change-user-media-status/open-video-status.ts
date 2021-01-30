import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
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
