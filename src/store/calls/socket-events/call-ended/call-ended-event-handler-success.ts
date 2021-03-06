import { createAction } from '@reduxjs/toolkit';

import { ICallsState } from '@store/calls/calls-state';

import { INormalizedCall } from '../../common/models';

export class CallEndedEventHandlerSuccess {
  static get action() {
    return createAction<INormalizedCall>('CallEndedEventHandlerSuccess');
  }

  static get reducer() {
    return (
      draft: ICallsState,
      { payload }: ReturnType<typeof CallEndedEventHandlerSuccess.action>,
    ) => {
      if (payload) {
        if (!draft.callList.callIds.includes(payload.id)) {
          draft.callList.callIds.unshift(payload.id);
        }

        draft.calls[payload.id] = payload;
      }

      draft.interlocutorId = undefined;
      draft.isInterlocutorBusy = false;
      draft.amICalling = false;
      draft.amICalled = false;
      draft.isCallAccepted = false;
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
