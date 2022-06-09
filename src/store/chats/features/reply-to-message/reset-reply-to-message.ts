import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export class ResetReplyToMessage {
  static get action() {
    return createAction('RESET_REPLY_TO_MESSAGE');
  }

  static get reducer() {
    return (draft: IChatsState) => {
      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

        if (chat) {
          chat.messageToReply = undefined;
        }
      }

      return draft;
    };
  }
}
