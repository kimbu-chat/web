import { IChatsState } from 'store/chats/models';
import produce from 'immer';
import { createAction } from 'typesafe-actions';

export class ResetSelectedMessages {
  static get action() {
    return createAction('RESET_SELECTED_MESSAGES')();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      if (draft.selectedChatId) {
        draft.messages[draft.selectedChatId].messages.forEach((message) => {
          message.isSelected = false;
        });
      }

      draft.selectedMessageIds = [];

      return draft;
    });
  }
}
