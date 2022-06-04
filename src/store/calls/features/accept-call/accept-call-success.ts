import { createAction } from '@reduxjs/toolkit';

import { ICallsState } from '../../calls-state';


export class AcceptCallSuccess {
  static get action() {
    return createAction('ACCEPT_CALL_SUCCESS');
  }

  static get reducer() {
    return (draft: ICallsState) => {
      draft.isActiveCallIncoming = true;
      draft.isSpeaking = true;
      draft.amICalled = false;
      draft.amICalling = false;
      draft.isCallAccepted = false;

      return draft;
    };
  }
}
