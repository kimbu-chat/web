import produce from 'immer';

import { createEmptyAction } from '@store/common/actions';

import { ICallsState } from '../../calls-state';

export class CancelCallSuccess {
  static get action() {
    return createEmptyAction('CANCEL_CALL_SUCCESS');
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
      // reset all values that may change durting call to default
      draft.interlocutorId = undefined;
      draft.isInterlocutorBusy = false;
      draft.amICalling = false;
      draft.isAcceptPending = false;
      draft.amICalled = false;
      draft.isSpeaking = false;
      draft.isInterlocutorVideoEnabled = false;
      draft.isInterlocutorAudioEnabled = false;
      draft.videoConstraints.isOpened = false;
      draft.videoConstraints.isOpened = false;
      draft.isScreenSharingOpened = false;
      return draft;
    });
  }
}
