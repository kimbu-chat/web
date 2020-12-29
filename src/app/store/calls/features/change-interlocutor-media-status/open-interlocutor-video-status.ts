import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { CallState } from '../../models';

export class OpenInterlocutorVideoStatus {
  static get action() {
    return createEmptyAction('OPEN_INTERLOCUTOR_VIDEO_STATUS');
  }

  static get reducer() {
    return produce((draft: CallState) => {
      draft.isInterlocutorVideoEnabled = true;
      return draft;
    });
  }
}
