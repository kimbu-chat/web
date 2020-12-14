import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { CallState } from '../../models';
import { InterlocutorAcceptedCallSuccessActionPayload } from './interlocutor-accepted-call-success-action-payload';

export class InterlocutorAcceptedCallSuccess {
  static get action() {
    return createAction('INTERLOCUTOR_ACCEPTED_CALL_SUCCESS')<InterlocutorAcceptedCallSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof InterlocutorAcceptedCallSuccess.action>) => {
      if (payload.interlocutorId !== payload.myId) {
        draft.isSpeaking = true;
        draft.amICalled = false;
        draft.amICaling = false;
        draft.isInterlocutorVideoEnabled = payload.isVideoEnabled;
      }
      return draft;
    });
  }
}
