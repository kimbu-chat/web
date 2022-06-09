import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IChangeChatMutedStatusSuccessActionPayload {
  chatId: number;
  isMuted: boolean;
}

export class ChangeChatMutedStatusSuccess {
  static get action() {
    return createAction<IChangeChatMutedStatusSuccessActionPayload>(
      'CHANGE_SELECTED_CHAT_MUTE_STATUS_SUCCESS',
    );
  }

  static get reducer() {
    return (
      draft: IChatsState,
      { payload }: ReturnType<typeof ChangeChatMutedStatusSuccess.action>,
    ) => {
      const { chatId } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.isMuted = !chat.isMuted;
      }

      return draft;
    };
  }
}
