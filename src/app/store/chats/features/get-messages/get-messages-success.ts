import { IChatsState } from 'store/chats/models';
import produce from 'immer';
import { unionBy } from 'lodash';
import { createAction } from 'typesafe-actions';
import { IGetMessagesSuccessActionPayload } from './action-payloads/get-messages-success-action-payload';

export class GetMessagesSuccess {
  static get action() {
    return createAction('GET_MESSAGES_SUCCESS')<IGetMessagesSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetMessagesSuccess.action>) => {
      const { chatId, hasMoreMessages, messages, isFromSearch }: IGetMessagesSuccessActionPayload = payload;

      console.log('GET_MESSAGES_SUCCESS');
      if (draft.messages[chatId]) {
        console.log('raft.messages[chatId]');

        draft.messages[chatId].hasMore = hasMoreMessages;

        draft.messages[chatId].loading = false;

        if (isFromSearch) {
          draft.messages[chatId].messages = messages;
        } else {
          draft.messages[chatId].messages = unionBy(draft.messages[chatId].messages, messages, 'id');
        }
      }

      return draft;
    });
  }
}
