import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { MessagesState } from '../models';

export class ResetEditMessage {
  static get action() {
    return createEmptyAction('RESET_EDIT_MESSAGE');
  }

  static get reducer() {
    return produce((draft: MessagesState) => {
      draft.messageToEdit = undefined;
      return draft;
    });
  }
}
