import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '../../chats-state';

export interface ILeaveGroupChatSuccessActionPayload {
  chatId: number;
}

export class LeaveGroupChatSuccess {
  static get action() {
    return createAction<ILeaveGroupChatSuccessActionPayload>('LEAVE_GROUP_CHAT_SUCCESS');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof LeaveGroupChatSuccess.action>) => {
        const { chatId } = payload;

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
