import { createAction } from '@reduxjs/toolkit';

import { INormalizedMessage } from '@store/chats/models';

import { IChatsState } from '../../chats-state';

export interface IGetMessagesSuccessActionPayload {
  messages: Record<number, INormalizedMessage>;
  messageIds: number[];
  hasMoreMessages: boolean;
  chatId: number;
  initializedByScroll?: boolean;
  searchString?: string;
}

export class GetMessagesSuccess {
  static get action() {
    return createAction<IGetMessagesSuccessActionPayload>('GET_MESSAGES_SUCCESS');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof GetMessagesSuccess.action>) => {
      const {
        chatId,
        hasMoreMessages,
        messages,
        messageIds,
        initializedByScroll,
      }: IGetMessagesSuccessActionPayload = payload;

      const chatMessages = draft.chats[chatId]?.messages;

      if (chatMessages) {
        chatMessages.hasMore = hasMoreMessages;

        chatMessages.loading = false;

        if (initializedByScroll) {
          chatMessages.messageIds = [...new Set([...chatMessages.messageIds, ...messageIds])];
          chatMessages.messages = { ...chatMessages.messages, ...messages };
        } else {
          const draftMessageId = draft.chats[chatId]?.draftMessageId;
          const lastMessageId = draft.chats[chatId]?.lastMessageId;
          let draftMessage;
          let lastMessage;

          if (draftMessageId) {
            draftMessage = draft.chats[chatId]?.messages.messages[draftMessageId];
          }

          if (lastMessageId) {
            lastMessage = draft.chats[chatId]?.messages.messages[lastMessageId];
          }

          chatMessages.messageIds = messageIds;
          chatMessages.messages = {
            ...messages,
            [`${draftMessageId}`]: draftMessage,
            [`${lastMessageId}`]: lastMessage,
          };
        }
      }

      return draft;
    };
  }
}
