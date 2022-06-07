import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IEditMessageActionPayload {
  messageId: number;
}

export class EditMessage {
  static get action() {
    return createAction<IEditMessageActionPayload>('EDIT_MESSAGE');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof EditMessage.action>) => {
      const { messageId } = payload;

      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

        const message = draft.chats[draft.selectedChatId]?.messages.messages[messageId];

        if (chat && chat.messageToEdit?.id !== message?.id) {
          chat.messageToEdit = message;
          chat.messageToReply = undefined;
        }
      }

      return draft;
    };
  }
}
