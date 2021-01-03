import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatListChatIndex } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IAddUsersToGroupChatSuccessActionPayload } from './add-users-to-group-chat-success-action-payload';

export class AddUsersToGroupChatSuccess {
  static get action() {
    return createAction('ADD_USERS_TO_GROUP_CHAT_SUCCESS')<IAddUsersToGroupChatSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof AddUsersToGroupChatSuccess.action>) => {
      const { chat, users } = payload;

      const chatIndex: number = getChatListChatIndex(chat.id, draft);

      draft.chats[chatIndex].groupChat!.membersCount = draft.chats[chatIndex].groupChat!.membersCount + 1;
      draft.chats[chatIndex].members.members = [...draft.chats[chatIndex].members.members, ...users];

      return draft;
    });
  }
}
