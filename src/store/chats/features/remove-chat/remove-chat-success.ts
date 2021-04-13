import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IRemoveChatSuccessActionPayload } from './action-payloads/remove-chat-success-action-payload';
import { getChatIndexDraftSelector } from '../../selectors';
import { IChatsState } from '../../chats-state';

export class RemoveChatSuccess {
  static get action() {
    return createAction('REMOVE_SELECTED_CHAT_SUCCESS')<IRemoveChatSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof RemoveChatSuccess.action>) => {
        const { chatId } = payload;

        const chatIndex: number = getChatIndexDraftSelector(chatId, draft);

        draft.chats.chats.splice(chatIndex, 1);

        if (draft.selectedChatId === chatId) {
          draft.selectedChatId = null;
        }

        return draft;
      },
    );
  }
}
