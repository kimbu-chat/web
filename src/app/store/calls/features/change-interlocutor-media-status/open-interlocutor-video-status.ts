import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { ICallsState } from '../../calls-state';

export class OpenInterlocutorVideoStatus {
  static get action() {
    return createEmptyAction('OPEN_INTERLOCUTOR_VIDEO_STATUS');
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
      draft.isInterlocutorVideoEnabled = true;
      return draft;
    });
  }
}
