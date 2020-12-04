import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../chats-utils';
import { Chat, ChatsState } from '../models';

export class MuteChatSuccess {
  static get action() {
    return createAction('MUTE_CHAT_SUCCESS')<Chat>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof MuteChatSuccess.action>) => {
      const { id } = payload;

      const chatIndex: number = getChatArrayIndex(id, draft);

      draft.chats[chatIndex].isMuted = !draft.chats[chatIndex].isMuted;

      return draft;
    });
  }
}
