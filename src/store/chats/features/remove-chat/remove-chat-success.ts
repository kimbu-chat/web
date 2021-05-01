import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IRemoveChatSuccessActionPayload } from './action-payloads/remove-chat-success-action-payload';
import { IChatsState } from '../../chats-state';

export class RemoveChatSuccess {
  static get action() {
    return createAction('REMOVE_SELECTED_CHAT_SUCCESS')<IRemoveChatSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof RemoveChatSuccess.action>) => {
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

        return draft;
      },
    );
  }
}
