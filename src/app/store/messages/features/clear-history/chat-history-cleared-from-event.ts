import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { MessagesState } from '../../models';
import { getChatIndex } from '../../selectors';
import { ChatHistoryClearedFromEventActionPayload } from './chat-history-cleared-from-event-action-payload';

export class ChatHistoryClearedFromEvent {
  static get action() {
    return createAction('CLEAR_CHAT_HISTORY_SUCCESS')<ChatHistoryClearedFromEventActionPayload>();
  }

  static get reducer() {
    return produce((draft: MessagesState, { payload }: ReturnType<typeof ChatHistoryClearedFromEvent.action>) => {
      const { chatId, onlyForUserInitiator } = payload;

      if (onlyForUserInitiator) {
        const chatIndex = getChatIndex(draft, chatId);

        if (chatIndex >= 0) {
          draft.messages[chatIndex].messages = [];
          draft.messages[chatIndex].hasMoreMessages = false;
        }
      }

      return draft;
    });
  }
}
