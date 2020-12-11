import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { MessagesState } from '../../models';
import { getChatIndex } from '../../selectors';
import { ClearChatHistorySuccessActionPayload } from './clear-chat-history-success-action-payload';

export class ClearChatHistorySuccess {
  static get action() {
    return createAction('CLEAR_CHAT_HISTORY_SUCCESS')<ClearChatHistorySuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: MessagesState, { payload }: ReturnType<typeof ClearChatHistorySuccess.action>) => {
      const { chatId } = payload;
      const chatIndex = getChatIndex(draft, chatId);

      if (chatIndex >= 0) {
        draft.messages[chatIndex].messages = [];
        draft.messages[chatIndex].hasMoreMessages = false;
      }

      return draft;
    });
  }
}
