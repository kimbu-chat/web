import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from 'app/store/chats/selectors';
import { IChangeLastMessageReq, IChatsState } from '../../models';

export class ChangeLastMessage {
  static get action() {
    return createAction('CHANGE_LAST_MESSAGE')<IChangeLastMessageReq>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof ChangeLastMessage.action>) => {
      const { chatId, newMessage } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].lastMessage = newMessage;
      }
    });
  }
}
