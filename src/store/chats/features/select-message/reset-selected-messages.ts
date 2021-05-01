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
        const selectedChatMessages = draft.messages[draft.selectedChatId];
        if (selectedChatMessages) {
          selectedChatMessages.messageIds.forEach((messageId) => {
            const currentMessage = selectedChatMessages.messages[messageId];

            if (currentMessage) {
              currentMessage.isSelected = false;
            }
          });
        }
      }

      draft.selectedMessageIds = [];

      return draft;
    });
  }
}
