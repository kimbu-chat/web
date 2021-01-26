import { IChatsState } from 'store/chats/models';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from '../../selectors';
import { IClearChatHistorySuccessActionPayload } from './action-payloads/clear-chat-history-success-action-payload';

export class ClearChatHistorySuccess {
  static get action() {
    return createAction('CLEAR_CHAT_HISTORY_SUCCESS')<IClearChatHistorySuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof ClearChatHistorySuccess.action>) => {
      const { chatId } = payload;
      const chat = getChatByIdDraftSelector(chatId, draft);

      draft.messages[chatId].messages = [];
      draft.messages[chatId].hasMore = false;
      draft.messages[chatId].loading = false;

      if (chat) {
        chat.lastMessage = null;
      }

      return draft;

      return draft;
    });
  }
}