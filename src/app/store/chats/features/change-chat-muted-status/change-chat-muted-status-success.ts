import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from 'app/store/chats/selectors';
import { IChangeChatMutedStatusSuccessActionPayload } from './action-payloads/change-chat-muted-status-success-action-payload';
import { IChatsState } from '../../chats-state';

export class ChangeChatMutedStatusSuccess {
  static get action() {
    return createAction('CHANGE_SELECTED_CHAT_MUTE_STATUS_SUCCESS')<IChangeChatMutedStatusSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof ChangeChatMutedStatusSuccess.action>) => {
      const { chatId } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.isMuted = !chat.isMuted;
      }

      return draft;
    });
  }
}
