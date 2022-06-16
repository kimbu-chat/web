import { createAction } from '@reduxjs/toolkit';

import { ICallsState } from '../../calls-state';

export class InterlocutorBusy {
  static get action() {
    return createAction('INTERLOCUTOR_BUSY');
  }

  static get reducer() {
    return (draft: ICallsState) => {
      draft.isInterlocutorBusy = true;

      return draft;
    };
  }
}
