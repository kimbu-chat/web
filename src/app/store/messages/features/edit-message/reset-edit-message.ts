import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { IMessagesState } from '../../models';

export class ResetEditMessage {
  static get action() {
    return createEmptyAction('RESET_EDIT_MESSAGE');
  }

  static get reducer() {
    return produce((draft: IMessagesState) => {
      draft.messageToEdit = undefined;
      return draft;
    });
  }
}
