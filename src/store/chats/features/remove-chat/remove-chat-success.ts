import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '../../chats-state';

export interface IRemoveChatSuccessActionPayload {
  chatId: number;
}

export class RemoveChatSuccess {
  static get action() {
    return createAction<IRemoveChatSuccessActionPayload>('REMOVE_CHAT_SUCCESS');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof RemoveChatSuccess.action>) => {
        const { chatId } = payload;

        draft.chatList.chatIds = draft.chatList.chatIds.filter((id) => id !== chatId);
        delete draft.chats[chatId];
        if (draft.selectedChatId === chatId) {
          draft.selectedChatId = undefined;
        }

        return draft;
      };
  }
}
