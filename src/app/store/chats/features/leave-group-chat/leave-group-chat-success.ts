import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../../chats-utils';
import { ChatsState } from '../../models';
import { LeaveGroupChatSuccessActionPayload } from './leave-group-chat-success-action-payload';

export class LeaveGroupChatSuccess {
  static get action() {
    return createAction('LEAVE_GROUP_CHAT_SUCCESS')<LeaveGroupChatSuccessActionPayload>();
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
