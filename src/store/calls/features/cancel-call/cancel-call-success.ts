import { createAction } from '@reduxjs/toolkit';

import { ICallsState } from '../../calls-state';

export class CancelCallSuccess {
  static get action() {
    return createAction('CANCEL_CALL_SUCCESS');
  }

  static get reducer() {
    return (draft: ICallsState) => {
      // reset all values that may change durting call to default
      draft.interlocutorId = undefined;
      draft.isInterlocutorBusy = false;
      draft.amICalling = false;
      draft.isCallAccepted = false;
      draft.amICalled = false;
      draft.isSpeaking = false;
      draft.isInterlocutorVideoEnabled = false;
      draft.isInterlocutorAudioEnabled = false;
      draft.videoConstraints.isOpened = false;
      draft.videoConstraints.isOpened = false;
      draft.isScreenSharingOpened = false;
      return draft;
    };
  }
}
