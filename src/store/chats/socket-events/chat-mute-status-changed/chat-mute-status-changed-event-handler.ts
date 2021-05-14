import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IChatsState } from '../../chats-state';

import { IChatMutedStatusChangedIntegrationEvent } from './chat-mute-status-changed-integration-event';

export class ChatMutedStatusChangedEventHandler {
  static get action() {
    return createAction('ChatsMuteStatusChanged')<IChatMutedStatusChangedIntegrationEvent>();
  }

  static get reducer() {
    return produce(
      (
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
      },
    );
  }
}
