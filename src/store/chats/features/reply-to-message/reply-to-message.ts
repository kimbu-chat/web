import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IReplyToMessageActionPayload {
  messageId: number;
}

export class ReplyToMessage {
  static get action() {
    return createAction<IReplyToMessageActionPayload>('REPLY_TO_MESSAGE');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof ReplyToMessage.action>) => {
      const { messageId } = payload;

      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);
        const message = draft.chats[draft.selectedChatId]?.messages.messages[messageId];

        if (chat) {
          chat.messageToReply = message;
          chat.messageToEdit = undefined;
        }
      }

      return draft;
    };
  }
}
