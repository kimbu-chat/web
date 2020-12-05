import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { CallState } from '../../models';

export class CancelCallSuccess {
  static get action() {
    return createEmptyAction('CANCEL_CALL_SUCCESS');
  }

  static get reducer() {
    return produce((draft: CallState) => {
      draft.interlocutor = undefined;
      draft.isInterlocutorBusy = false;
      draft.amICaling = false;
      draft.amICalled = false;
      draft.isSpeaking = false;
      draft.offer = undefined;
      draft.answer = undefined;
      draft.isInterlocutorVideoEnabled = false;
      draft.videoConstraints.isOpened = false;
      draft.videoConstraints.isOpened = false;
      draft.isScreenSharingOpened = false;
      return draft;
    });
  }
}
