import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { ICallsState } from '../../calls-state';

export class AcceptCallSuccess {
  static get action() {
    return createEmptyAction('ACCEPT_CALL_SUCCESS');
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
      draft.isActiveCallIncoming = true;
      draft.isSpeaking = true;
      draft.amICalled = false;
      draft.amICalling = false;

      return draft;
    });
  }
}
