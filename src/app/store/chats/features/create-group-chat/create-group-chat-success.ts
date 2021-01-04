import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatExistsDraftSelector } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { ICreateGroupChatSuccessActionPayload } from './create-group-chat-success-action-payload';

export class CreateGroupChatSuccess {
  static get action() {
    return createAction('CREATE_GROUP_CHAT_SUCCESS')<ICreateGroupChatSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof CreateGroupChatSuccess.action>) => {
      const newChat = payload;

      const isChatExists: boolean = getChatExistsDraftSelector(newChat.id, draft);

      if (!isChatExists) {
        draft.chats.unshift(newChat);
        return draft;
      }

      return draft;
    });
  }
}
