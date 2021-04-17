import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatIndexDraftSelector } from '../../selectors';
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

        const chatIndex: number = getChatIndexDraftSelector(chatId, draft);

        draft.chats.chats.splice(chatIndex, 1);

        if (draft.selectedChatId === chatId) {
          draft.selectedChatId = null;
        }

        delete draft.messages[chatId];

        return draft;
      },
    );
  }
}
