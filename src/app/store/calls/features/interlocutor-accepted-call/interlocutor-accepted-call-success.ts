import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { InterlocutorAcceptCallActionPayload, CallState } from '../../models';

export class InterlocutorAcceptedCallSuccess {
  static get action() {
    return createAction('INTERLOCUTOR_ACCEPTED_CALL_SUCCESS')<InterlocutorAcceptCallActionPayload>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof InterlocutorAcceptedCallSuccess.action>) => {
      if (draft.amICaling || (draft.isSpeaking && payload.isRenegotiation)) {
        draft.isSpeaking = true;
        draft.amICalled = false;
        draft.amICaling = false;
        draft.answer = payload.answer;
        draft.isInterlocutorVideoEnabled = payload.isVideoEnabled;
      }
      return draft;
    });
  }
}
