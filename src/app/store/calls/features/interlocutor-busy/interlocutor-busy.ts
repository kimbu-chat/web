import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { ICallsState } from '../../models';

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
