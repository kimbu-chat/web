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
            chatMessages.messages = { ...messages, ...chatMessages.messages };
          } else {
            const draftMessageId = draft.chats[chatId]?.draftMessageId;
            let draftMessage;

            if (draftMessageId) {
              draftMessage = draft.chats[chatId]?.messages.messages[draftMessageId];
            }

            chatMessages.messageIds = messageIds;
            chatMessages.messages = {...messages, [`${draftMessageId}`]: draftMessage }
          }
        }

        return draft;
      };
  }
}
