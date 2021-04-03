import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { ICallsState } from '@store/calls/calls-state';

import { ICall } from '../../common/models';

export class CallEndedEventHandlerSuccess {
  static get action() {
    return createAction('CallEndedEventHandlerSuccess')<ICall>();
  }

  static get reducer() {
    return produce(
      (draft: ICallsState, { payload }: ReturnType<typeof CallEndedEventHandlerSuccess.action>) => {
        if (payload) {
          draft.calls.calls.unshift(payload);
        }

        draft.interlocutor = undefined;
        draft.isInterlocutorBusy = false;
        draft.amICalling = false;
        draft.amICalled = false;
        draft.isSpeaking = false;
        draft.isInterlocutorVideoEnabled = false;
        draft.isInterlocutorAudioEnabled = false;
        draft.videoConstraints.isOpened = false;
        draft.videoConstraints.isOpened = false;
        draft.isScreenSharingOpened = false;

        return draft;
      },
    );
  }
}
