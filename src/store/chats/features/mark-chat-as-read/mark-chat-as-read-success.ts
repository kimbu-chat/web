import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IMarkChatAsReadSuccessActionPayload {
  chatId: number;
  lastReadMessageId: number;
}

export class MarkChatAsReadSuccess {
  static get action() {
    return createAction<IMarkChatAsReadSuccessActionPayload>('MARK_CHAT_AS_READ_SUCCESS');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof MarkChatAsReadSuccess.action>) => {
      const { chatId } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.unreadMessagesCount = 0;
      }

      return draft;
    };
  }
}
