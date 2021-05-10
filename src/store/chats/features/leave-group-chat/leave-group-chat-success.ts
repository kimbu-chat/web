import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IChatsState } from '../../chats-state';
import { ILeaveGroupChatSuccessActionPayload } from './action-payloads/leave-group-chat-success-action-payload';

export class LeaveGroupChatSuccess {
  static get action() {
    return createAction('LEAVE_GROUP_CHAT_SUCCESS')<ILeaveGroupChatSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof LeaveGroupChatSuccess.action>) => {
        const { chatId } = payload;

        draft.chatList.chatIds = draft.chatList.chatIds.filter((id) => id !== chatId);

        delete draft.chats[chatId];

        if (draft.selectedChatId === chatId) {
          draft.selectedChatId = null;
        }
        // TODO: handle user deleteing

        return draft;
      },
    );
  }
}
