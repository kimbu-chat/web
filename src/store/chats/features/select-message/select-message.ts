import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '../../chats-state';
import { getMessageDraftSelector } from '../../selectors';

export interface ISelectMessageActionPayload {
  messageId: number;
}

export class SelectMessage {
  static get action() {
    return createAction<ISelectMessageActionPayload>('SELECT_MESSAGE');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof SelectMessage.action>) => {
      const { messageId } = payload;

      if (draft.selectedChatId) {
        const message = getMessageDraftSelector(draft.selectedChatId, messageId, draft);

        if (message) {
          const isMessageSelected = draft.selectedMessageIds.includes(message.id);

          if (!isMessageSelected) {
            draft.selectedMessageIds.push(payload.messageId);
          } else {
            draft.selectedMessageIds = draft.selectedMessageIds.filter(
              (id) => id !== payload.messageId,
            );
          }
        }
      }

      return draft;
    };
  }
}
