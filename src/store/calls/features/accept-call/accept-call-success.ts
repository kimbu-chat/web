import produce from 'immer';

import { createEmptyAction } from '@store/common/actions';

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
      draft.isCallAccepted = false;

      return draft;
    });
  }
}
