import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { CallState } from '../../models';

export class AcceptCallSuccess {
  static get action() {
    return createEmptyAction('ACCEPT_CALL_SUCCESS');
  }

  static get reducer() {
    return produce((draft: CallState) => {
      draft.isActiveCallIncoming = true;
      draft.isSpeaking = true;
      draft.amICalled = false;
      draft.amICalling = false;

      return draft;
    });
  }
}
