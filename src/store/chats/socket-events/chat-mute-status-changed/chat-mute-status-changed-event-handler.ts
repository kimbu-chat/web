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

        const selectedChats = draft.chats.filter((chat) => chatIds.includes(chat.id));

        selectedChats.forEach((_, index) => {
          selectedChats[index].isMuted = isMuted;
        });

        return draft;
      },
    );
  }
}
