import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from 'app/store/chats/selectors';
import { ChatsState } from '../../models';
import { MuteChatSuccessActionPayload } from './mute-chat-success-action-payload';

export class MuteChatSuccess {
  static get action() {
    return createAction('MUTE_CHAT_SUCCESS')<MuteChatSuccessActionPayload>();
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
