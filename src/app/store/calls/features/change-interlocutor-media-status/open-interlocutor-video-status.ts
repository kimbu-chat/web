import produce from 'immer';
import { createEmptyAction } from '@store/common/actions';
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
