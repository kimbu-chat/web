import { IChatsState } from 'store/chats/models';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from '../../selectors';
import { IClearChatHistorySuccessActionPayload } from './clear-chat-history-success-action-payload';

export class ClearChatHistorySuccess {
  static get action() {
    return createAction('CLEAR_CHAT_HISTORY_SUCCESS')<IClearChatHistorySuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof ClearChatHistorySuccess.action>) => {
      const { chatId } = payload;
      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.messages.messages = [];
        chat.messages.hasMore = false;
        chat.messages.loading = false;
        chat.lastMessage = null;
      }

      return draft;

      return draft;
    });
  }
}
