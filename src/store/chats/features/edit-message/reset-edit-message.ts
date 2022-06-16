import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export class ResetEditMessage {
  static get action() {
    return createAction('RESET_EDIT_MESSAGE');
  }

  static get reducer() {
    return (draft: IChatsState) => {
      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

        if (chat) {
          chat.messageToEdit = undefined;
        }
      }

      return draft;
    };
  }
}
