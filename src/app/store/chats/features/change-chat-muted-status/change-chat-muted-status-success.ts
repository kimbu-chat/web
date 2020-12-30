import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IChangeChatMutedStatusSuccessActionPayload } from './change-chat-muted-status-success-action-payload';

export class ChangeChatMutedStatusSuccess {
  static get action() {
    return createAction('CHANGE_CHAT_MUTE_STATUS_SUCCESS')<IChangeChatMutedStatusSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof ChangeChatMutedStatusSuccess.action>) => {
      const { chatId } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      draft.chats[chatIndex].isMuted = !draft.chats[chatIndex].isMuted;

      return draft;
    });
  }
}
