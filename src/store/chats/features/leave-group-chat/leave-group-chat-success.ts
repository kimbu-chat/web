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

        const chatIndex = draft.chatList.chatIds.indexOf(chatId);
        if (chatIndex !== 0) {
          draft.chatList.chatIds.splice(chatIndex, 1);

          delete draft.chats[chatId];
        }

        if (draft.selectedChatId === chatId) {
          draft.selectedChatId = null;
        }

        delete draft.messages[chatId];

        // TODO: handle user deleteing

        return draft;
      },
    );
  }
}
