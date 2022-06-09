import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '../../chats-state';

export class GetMessagesFailure {
  static get action() {
    return createAction<number>('GET_MESSAGES_FAILURE');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof GetMessagesFailure.action>) => {
      const chatMessages = draft.chats[payload]?.messages;

      if (chatMessages) {
        chatMessages.loading = false;
      }

      return draft;
    };
  }
}
