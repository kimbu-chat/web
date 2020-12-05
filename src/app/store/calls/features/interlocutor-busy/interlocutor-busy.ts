import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { CallState } from '../../models';

export class InterlocutorBusy {
  static get action() {
    return createEmptyAction('INTERLOCUTOR_BUSY');
  }

  static get reducer() {
    return produce((draft: CallState) => {
      draft.isInterlocutorBusy = true;

      return draft;
    });
  }
}
