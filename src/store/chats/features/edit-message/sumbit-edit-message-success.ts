import { createAction } from '@reduxjs/toolkit';

import { MessageState } from '@store/chats/models';

import { IChatsState } from '../../chats-state';

export interface ISumbitEditMessageSuccessActionPayload {
  messageId: number;
  chatId: number;
}

export class SubmitEditMessageSuccess {
  static get action() {
    return createAction<ISumbitEditMessageSuccessActionPayload>('SUBMIT_EDIT_MESSAGE_SUCCESS');
  }

  static get reducer() {
    return (
      draft: IChatsState,
      { payload }: ReturnType<typeof SubmitEditMessageSuccess.action>,
    ) => {
      const { chatId, messageId } = payload;

      const message = draft.chats[chatId]?.messages.messages[messageId];

      if (message) {
        message.state = MessageState.SENT;
      }

      return draft;
    };
  }
}
