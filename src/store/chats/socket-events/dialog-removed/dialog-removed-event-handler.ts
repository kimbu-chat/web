import { createAction } from '@reduxjs/toolkit';

import { ChatId } from '../../chat-id';
import { IChatsState } from '../../chats-state';

export interface IDialogRemovedIntegrationEvent {
  userInterlocutorId: number;
}

export class DialogRemovedEventHandler {
  static get action() {
    return createAction<IDialogRemovedIntegrationEvent>('DialogRemoved');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof DialogRemovedEventHandler.action>) => {
        const { userInterlocutorId } = payload;
        const chatId = ChatId.from(userInterlocutorId).id;

        draft.chatList.chatIds = draft.chatList.chatIds.filter((id) => id !== chatId);
        delete draft.chats[chatId];

        if (draft.selectedChatId === chatId) {
          draft.selectedChatId = undefined;
        }

        // TODO: handle user deleteing

        return draft;
      };
  }
}
