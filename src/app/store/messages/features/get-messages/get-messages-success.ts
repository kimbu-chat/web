import produce from 'immer';
import { unionBy } from 'lodash';
import { createAction } from 'typesafe-actions';
import { checkIfChatExists, getMessagesChatIndex } from 'app/store/messages/selectors';
import { IMessagesState } from '../../models';
import { IGetMessagesSuccessActionPayload } from './get-messages-success-action-payload';

export class GetMessagesSuccess {
  static get action() {
    return createAction('GET_MESSAGES_SUCCESS')<IGetMessagesSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IMessagesState, { payload }: ReturnType<typeof GetMessagesSuccess.action>) => {
      const { chatId, hasMoreMessages, messages }: IGetMessagesSuccessActionPayload = payload;
      const isChatExists = checkIfChatExists(draft, chatId);

      draft.loading = false;
      if (!isChatExists) {
        draft.messages.push({
          chatId,
          hasMoreMessages,
          messages,
        });
      } else {
        const chatIndex = getMessagesChatIndex(draft, chatId);

        draft.messages[chatIndex].hasMoreMessages = hasMoreMessages;

        draft.messages[chatIndex].messages = unionBy(draft.messages[chatIndex].messages, messages, 'id');
      }

      return draft;
    });
  }
}
