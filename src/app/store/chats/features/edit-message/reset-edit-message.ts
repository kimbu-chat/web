import { IChatsState } from 'store/chats/models';
import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';

export class ResetEditMessage {
  static get action() {
    return createEmptyAction('RESET_EDIT_MESSAGE');
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      draft.messageToEdit = undefined;
      return draft;
    });
  }
}
