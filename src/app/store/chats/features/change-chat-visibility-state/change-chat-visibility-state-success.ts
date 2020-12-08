import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../../chats-utils';
import { ChatsState } from '../../models';
import { ChangeChatVisibilityStateSuccessActionPayload } from './change-chat-visibility-state-success-action-payload';

export class ChangeChatVisibilityStateSuccess {
  static get action() {
    return createAction('CHANGE_CHAT_VISIBILITY_STATE_SUCCESS')<ChangeChatVisibilityStateSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof ChangeChatVisibilityStateSuccess.action>) => {
      const chatIndex: number = getChatArrayIndex(payload.id, draft);
      draft.chats.splice(chatIndex, 1);
      draft.selectedChatId = -1;
      return draft;
    });
  }
}
