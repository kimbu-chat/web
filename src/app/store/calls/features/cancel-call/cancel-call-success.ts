import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { ICallsState } from '../../calls-state';

export class CancelCallSuccess {
  static get action() {
    return createEmptyAction('CANCEL_CALL_SUCCESS');
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
      draft.interlocutor = undefined;
      draft.isInterlocutorBusy = false;
      draft.amICalling = false;
      draft.amICalled = false;
      draft.isSpeaking = false;
      draft.isInterlocutorVideoEnabled = false;
      draft.videoConstraints.isOpened = false;
      draft.videoConstraints.isOpened = false;
      draft.isScreenSharingOpened = false;
      return draft;
    });
  }
}
