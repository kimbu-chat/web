import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatIndexDraftSelector } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IChangeChatVisibilityStateSuccessActionPayload } from './action-payloads/change-chat-visibility-state-success-action-payload';

export class ChangeChatVisibilityStateSuccess {
  static get action() {
    return createAction('CHANGE_CHAT_VISIBILITY_STATE_SUCCESS')<IChangeChatVisibilityStateSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof ChangeChatVisibilityStateSuccess.action>) => {
      const chatIndex: number = getChatIndexDraftSelector(payload.chatId, draft);

      draft.chats.splice(chatIndex, 1);

      if (draft.selectedChatId === payload.chatId) {
        draft.selectedChatId = null;
      }

      return draft;
    });
  }
}
