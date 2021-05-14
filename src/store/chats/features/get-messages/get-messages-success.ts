import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IChatsState } from '../../chats-state';

import { IGetMessagesSuccessActionPayload } from './action-payloads/get-messages-success-action-payload';

export class GetMessagesSuccess {
  static get action() {
    return createAction('GET_MESSAGES_SUCCESS')<IGetMessagesSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof GetMessagesSuccess.action>) => {
        const {
          messageList: { chatId, hasMoreMessages, messages, messageIds, isFromScroll },
        }: IGetMessagesSuccessActionPayload = payload;

        const chatMessages = draft.chats[chatId]?.messages;

        if (chatMessages) {
          chatMessages.hasMore = hasMoreMessages;

          chatMessages.loading = false;

          if (isFromScroll) {
            chatMessages.messageIds = [...new Set([...chatMessages.messageIds, ...messageIds])];
            chatMessages.messages = { ...messages, ...chatMessages.messages };
          } else {
            chatMessages.messageIds = messageIds;
            chatMessages.messages = messages;
          }
        }

        return draft;
      },
    );
  }
}
