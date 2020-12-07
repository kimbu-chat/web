import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { CleatChatHistoryReq, MessagesState } from '../../models';
import { getChatIndex } from '../../selectors';

export class ClearChatHistorySuccess {
  static get action() {
    return createAction('CLEAR_CHAT_HISTORY_SUCCESS')<CleatChatHistoryReq>();
  }

  static get reducer() {
    return produce((draft: MessagesState, { payload }: ReturnType<typeof ClearChatHistorySuccess.action>) => {
      const { chatId } = payload;
      const chatIndex = getChatIndex(draft, chatId);

      if (chatIndex >= 0) {
        draft.messages[chatIndex].messages = [];
      }

      return draft;
    });
  }
}
