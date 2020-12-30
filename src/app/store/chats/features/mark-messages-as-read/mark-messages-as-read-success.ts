import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IMarkMessagesAsReadSuccessActionPayload } from './mark-messages-as-read-success-action-payload';

export class MarkMessagesAsReadSuccess {
  static get action() {
    return createAction('RESET_UNREAD_MESSAGES_COUNT_SUCCESS')<IMarkMessagesAsReadSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof MarkMessagesAsReadSuccess.action>) => {
      const { chatId } = payload;
      const chatIndex: number = getChatArrayIndex(chatId, draft);
      draft.chats[chatIndex].unreadMessagesCount = 0;
      return draft;
    });
  }
}
