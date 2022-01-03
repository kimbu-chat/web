import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

import { IClearChatHistorySuccessActionPayload } from './action-payloads/clear-chat-history-success-action-payload';

export class ClearChatHistorySuccess {
  static get action() {
    return createAction('CLEAR_CHAT_HISTORY_SUCCESS')<IClearChatHistorySuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof ClearChatHistorySuccess.action>) => {
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
      },
    );
  }
}
