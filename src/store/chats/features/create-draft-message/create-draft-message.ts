import { createAction } from '@reduxjs/toolkit';

import { INormalizedMessage } from '@store/chats/models';

import { IChatsState } from '../../chats-state';

export class CreateDraftMessage {
  static get action() {
    return createAction<INormalizedMessage>('CREATE_DRAFT_MESSAGE');
  }

  static get reducer() {
    return (
      draft: IChatsState,
      { payload: message }: ReturnType<typeof CreateDraftMessage.action>,
    ) => {
      const chat = draft.chats[message.chatId];
      const chatMessages = chat?.messages;
      chatMessages.messages[message.id] = message;
      chat.draftMessageId = message.id;

      return draft;
    };
  }
}
