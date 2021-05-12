import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IRemoveChatSuccessActionPayload } from './action-payloads/remove-chat-success-action-payload';
import { IChatsState } from '../../chats-state';

export class RemoveChatSuccess {
  static get action() {
    return createAction('REMOVE_CHAT_SUCCESS')<IRemoveChatSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof RemoveChatSuccess.action>) => {
        const { chatId } = payload;

        draft.chatList.chatIds = draft.chatList.chatIds.filter((id) => id !== chatId);
        delete draft.chats[chatId];
        if (draft.selectedChatId === chatId) {
          draft.selectedChatId = null;
        }

        return draft;
      },
    );
  }
}
