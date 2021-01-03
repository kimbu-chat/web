import { getChatListChatIndex } from 'app/store/chats/selectors';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IChatsState } from '../../models';
import { ILeaveGroupChatSuccessActionPayload } from './leave-group-chat-success-action-payload';

export class LeaveGroupChatSuccess {
  static get action() {
    return createAction('LEAVE_GROUP_CHAT_SUCCESS')<ILeaveGroupChatSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof LeaveGroupChatSuccess.action>) => {
      const chatIndex: number = getChatListChatIndex(payload.id, draft);
      draft.chats.splice(chatIndex, 1);
      draft.selectedChatId = null;
      return draft;
    });
  }
}
