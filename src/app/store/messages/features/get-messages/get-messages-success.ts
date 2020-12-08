import produce from 'immer';
import { unionBy } from 'lodash';
import { createAction } from 'typesafe-actions';
import { checkIfChatExists, getChatIndex } from 'app/store/messages/selectors';
import { MessagesState } from '../../models';
import { GetMessagesSuccessActionPayload } from './get-messages-success-action-payload';

export class GetMessagesSuccess {
  static get action() {
    return createAction('GET_MESSAGES_SUCCESS')<GetMessagesSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: MessagesState, { payload }: ReturnType<typeof GetMessagesSuccess.action>) => {
      const { chatId, hasMoreMessages, messages }: GetMessagesSuccessActionPayload = payload;
      const isChatExists = checkIfChatExists(draft, chatId);

      draft.loading = false;
      if (!isChatExists) {
        draft.messages.push({
          chatId,
          hasMoreMessages,
          messages,
        });
      } else {
        const chatIndex = getChatIndex(draft, chatId);

        draft.messages[chatIndex].hasMoreMessages = hasMoreMessages;

        draft.messages[chatIndex].messages = unionBy(draft.messages[chatIndex].messages, messages, 'id');
      }

      return draft;
    });
  }
}
