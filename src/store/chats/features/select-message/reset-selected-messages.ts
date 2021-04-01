import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IChatsState } from '../../chats-state';

export class ResetSelectedMessages {
  static get action() {
    return createAction('RESET_SELECTED_MESSAGES')();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      if (draft.selectedChatId) {
        draft.messages[draft.selectedChatId].messages = draft.messages[
          draft.selectedChatId
        ].messages.map((message) => ({
          ...message,
          isSelected: false,
        }));
      }

      draft.selectedMessageIds = [];

      return draft;
    });
  }
}
