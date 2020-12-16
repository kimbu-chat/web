import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from 'app/store/chats/selectors';
import { ChangeLastMessageReq, ChatsState } from '../../models';

export class ChangeLastMessage {
  static get action() {
    return createAction('CHANGE_LAST_MESSAGE')<ChangeLastMessageReq>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof ChangeLastMessage.action>) => {
      const { chatId, newMessage } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].lastMessage = newMessage;
      }
    });
  }
}
