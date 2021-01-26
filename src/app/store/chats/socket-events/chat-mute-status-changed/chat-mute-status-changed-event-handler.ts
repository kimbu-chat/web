import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IChatsState } from '../../models';
import { IChatMutedStatusChangedIntegrationEvent } from './chat-mute-status-changed-integration-event';

export class ChatMutedStatusChangedEventHandler {
  static get action() {
    return createAction('ChatsMuteStatusChanged')<IChatMutedStatusChangedIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof ChatMutedStatusChangedEventHandler.action>) => {
      const { chatIds, isMuted } = payload;

      draft.chats.map((chat) => {
        if (chatIds.includes(chat.id)) {
          chat.isMuted = isMuted;
        }

        return chat;
      });

      return draft;
    });
  }
}