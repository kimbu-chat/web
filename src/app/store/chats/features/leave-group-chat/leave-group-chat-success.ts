import { getChatIndexDraftSelector } from 'app/store/chats/selectors';
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
      const { chatId } = payload;

      const chatIndex: number = getChatIndexDraftSelector(chatId, draft);

      draft.chats.splice(chatIndex, 1);
      draft.selectedChatId = null;

      return draft;
    });
  }
}
