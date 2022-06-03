import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IClearChatHistorySuccessActionPayload {
  chatId: number;
}

export class ClearChatHistorySuccess {
  static get action() {
    return createAction<IClearChatHistorySuccessActionPayload>('CLEAR_CHAT_HISTORY_SUCCESS');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof ClearChatHistorySuccess.action>) => {
        const { chatId } = payload;
        const chat = getChatByIdDraftSelector(chatId, draft);

        const chatMessages = draft.chats[chatId]?.messages;

        if (chatMessages && chatMessages.messageIds.length !== 0) {
          chatMessages.messages = {};
          chatMessages.messageIds = [];
          chatMessages.hasMore = false;
          chatMessages.loading = false;

          if (chat) {
            chat.lastMessageId = undefined;
          }
        }

        return draft;
      };
  }
}
