import produce from 'immer';

import { createEmptyAction } from '@store/common/actions';

import { ICallsState } from '../../calls-state';

export class InterlocutorBusy {
  static get action() {
    return createEmptyAction('INTERLOCUTOR_BUSY');
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
      draft.isInterlocutorBusy = true;

      return draft;
    });
  }
}
