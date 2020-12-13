import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../../chats-utils';
import { ChatsState } from '../../models';
import { AddUsersToGroupChatSuccessActionPayload } from './add-users-to-group-chat-success-action-payload';

export class AddUsersToGroupChatSuccess {
  static get action() {
    return createAction('ADD_USERS_TO_GROUP_CHAT_SUCCESS')<AddUsersToGroupChatSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof AddUsersToGroupChatSuccess.action>) => {
      const { chat, users } = payload;

      const chatIndex: number = getChatArrayIndex(chat.id, draft);

      draft.chats[chatIndex].groupChat!.membersCount = draft.chats[chatIndex].groupChat!.membersCount + 1;
      draft.chats[chatIndex].members.members = [...draft.chats[chatIndex].members.members, ...users];

      return draft;
    });
  }
}
