import { IChatsState } from 'store/chats/models';
import produce from 'immer';
import { unionBy } from 'lodash';
import { createAction } from 'typesafe-actions';
import { IGetMessagesSuccessActionPayload } from './action-payloads/get-messages-success-action-payload';
import { getChatByIdDraftSelector } from '../../selectors';

export class GetMessagesSuccess {
  static get action() {
    return createAction('GET_MESSAGES_SUCCESS')<IGetMessagesSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetMessagesSuccess.action>) => {
      const { chatId, hasMoreMessages, messages }: IGetMessagesSuccessActionPayload = payload;

      draft.loading = false;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.messages.hasMore = hasMoreMessages;

        chat.messages.messages = unionBy(chat.messages.messages, messages, 'id');
      }

      return draft;
    });
  }
}
