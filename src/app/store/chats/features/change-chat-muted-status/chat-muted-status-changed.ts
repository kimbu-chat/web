import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IChatsState } from '../../models';
import { IChatMutedStatusChangedActionPayload } from './chat-muted-status-changed-action-payload';

export class ChatMutedStatusChanged {
  static get action() {
    return createAction('СHAT_MUTED_STATUS_CHANGED')<IChatMutedStatusChangedActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof ChatMutedStatusChanged.action>) => {
      const { chatIds, isMuted } = payload;

      draft.chats.map((chat) => {
        if (chatIds.includes(chat.id)) {
          chat.isMuted = !isMuted;
        }

        return chat;
      });

      return draft;
    });
  }
}
