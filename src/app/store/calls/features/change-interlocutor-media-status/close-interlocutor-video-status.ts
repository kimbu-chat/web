import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { ICallState } from '../../models';

export class CloseInterlocutorVideoStatus {
  static get action() {
    return createEmptyAction('CLOSE_INTERLOCUTOR_VIDEO_STATUS');
  }

  static get reducer() {
    return produce((draft: ICallState) => {
      draft.isInterlocutorVideoEnabled = false;
      return draft;
    });
  }
}
