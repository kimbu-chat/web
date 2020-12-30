import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IMessagesState } from '../../models';
import { getChatIndex } from '../../selectors';
import { IChatHistoryClearedFromEventActionPayload } from './chat-history-cleared-from-event-action-payload';

export class ChatHistoryClearedFromEvent {
  static get action() {
    return createAction('CLEAR_CHAT_HISTORY_SUCCESS')<IChatHistoryClearedFromEventActionPayload>();
  }

  static get reducer() {
    return produce((draft: IMessagesState, { payload }: ReturnType<typeof ChatHistoryClearedFromEvent.action>) => {
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
