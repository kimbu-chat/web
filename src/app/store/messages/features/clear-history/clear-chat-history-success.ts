import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IMessagesState } from '../../models';
import { getMessagesChatIndex } from '../../selectors';
import { IClearChatHistorySuccessActionPayload } from './clear-chat-history-success-action-payload';

export class ClearChatHistorySuccess {
  static get action() {
    return createAction('CLEAR_CHAT_HISTORY_SUCCESS')<IClearChatHistorySuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IMessagesState, { payload }: ReturnType<typeof ClearChatHistorySuccess.action>) => {
      const { chatId } = payload;
      const chatIndex = getMessagesChatIndex(draft, chatId);

      if (chatIndex >= 0) {
        draft.messages[chatIndex].messages = [];
        draft.messages[chatIndex].hasMoreMessages = false;
      }

      return draft;
    });
  }
}
