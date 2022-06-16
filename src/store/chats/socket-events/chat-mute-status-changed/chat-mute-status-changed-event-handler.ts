import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '../../chats-state';

export interface IChatMutedStatusChangedIntegrationEvent {
  chatIds: number[];
  isMuted: boolean;
}

export class ChatMutedStatusChangedEventHandler {
  static get action() {
    return createAction<IChatMutedStatusChangedIntegrationEvent>('ChatsMuteStatusChanged');
  }

  static get reducer() {
    return (
      draft: IChatsState,
      { payload }: ReturnType<typeof ChatMutedStatusChangedEventHandler.action>,
    ) => {
      const { chatIds, isMuted } = payload;

      chatIds.forEach((chatId) => {
        const chat = draft.chats[chatId];

        if (chat) {
          chat.isMuted = isMuted;
        }
      });

      return draft;
    };
  }
}
