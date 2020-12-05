import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { AcceptIncomingCallActionPayload, CallState } from '../../models';

export class AcceptCallSuccess {
  static get action() {
    return createAction('ACCEPT_CALL_SUCCESS')<AcceptIncomingCallActionPayload>();
  }

  static get reducer() {
    return produce((draft: CallState) => {
      draft.isSpeaking = true;
      draft.amICalled = false;
      draft.amICaling = false;
      return draft;
    });
  }
}
