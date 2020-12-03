import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../chats-utils';
import { Chat, ChatsState } from '../models';

export class LeaveGroupChatSuccess {
  static get action() {
    return createAction('LEAVE_GROUP_CHAT_SUCCESS')<Chat>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof LeaveGroupChatSuccess.action>) => {
      const chatIndex: number = getChatArrayIndex(payload.id, draft);
      draft.chats.splice(chatIndex, 1);
      draft.selectedChatId = -1;
      return draft;
    });
  }
}
