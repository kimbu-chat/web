import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { ICallsState } from '../../models';

export class CloseInterlocutorVideoStatus {
  static get action() {
    return createEmptyAction('CLOSE_INTERLOCUTOR_VIDEO_STATUS');
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
      draft.isInterlocutorVideoEnabled = false;
      return draft;
    });
  }
}
