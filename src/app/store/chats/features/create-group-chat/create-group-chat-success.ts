import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { checkChatExists } from '../../chats-utils';
import { Chat, ChatsState } from '../../models';

export class CreateGroupChatSuccess {
  static get action() {
    return createAction('CREATE_GROUP_CHAT_SUCCESS')<Chat>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof CreateGroupChatSuccess.action>) => {
      const newChat = payload;

      const isChatExists: boolean = checkChatExists(newChat.id, draft);

      if (!isChatExists) {
        draft.chats.unshift(newChat);
        return draft;
      }

      return draft;
    });
  }
}
