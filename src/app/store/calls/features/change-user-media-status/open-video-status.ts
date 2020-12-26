import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { CallState } from '../../models';

export class OpenVideoStatus {
  static get action() {
    return createEmptyAction('OPEN_VIDEO_STATUS');
  }

  static get reducer() {
    return produce((draft: CallState) => {
      draft.videoConstraints.isOpened = true;
      return draft;
    });
  }
}
