import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { CallState } from '../../models';
import { AcceptCallSuccessActionPayload } from './accept-call-success-action-payload';

export class AcceptCallSuccess {
  static get action() {
    return createAction('ACCEPT_CALL_SUCCESS')<AcceptCallSuccessActionPayload>();
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
