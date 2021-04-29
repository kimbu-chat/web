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
          messageList: { chatId, hasMoreMessages, messages, isFromSearch, messageIds },
        }: IGetMessagesSuccessActionPayload = payload;

        const chatMessages = draft.messages[chatId];

        if (chatMessages) {
          chatMessages.hasMore = hasMoreMessages;

          chatMessages.loading = false;

          if (isFromSearch) {
            chatMessages.messageIds = messageIds;
            chatMessages.messages = messages;
          } else {
            chatMessages.messageIds = [...new Set([...chatMessages.messageIds, ...messageIds])];
            chatMessages.messages = { ...messages, ...chatMessages.messages };
          }
        }

        return draft;
      },
    );
  }
}
