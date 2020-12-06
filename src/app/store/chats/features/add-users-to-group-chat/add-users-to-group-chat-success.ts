import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../../chats-utils';
import { AddUsersToGroupChatActionData, ChatsState } from '../../models';

export class AddUsersToGroupChatSuccess {
  static get action() {
    return createAction('ADD_USERS_TO_GROUP_CHAT_SUCCESS')<AddUsersToGroupChatActionData>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof AddUsersToGroupChatSuccess.action>) => {
      const { chat, users } = payload;

      const chatIndex: number = getChatArrayIndex(chat.id, draft);

      draft.chats[chatIndex].groupChat!.membersCount = draft.chats[chatIndex].groupChat!.membersCount + 1;
      draft.chats[chatIndex].members = [...(draft.chats[chatIndex].members || []), ...users];

      return draft;
    });
  }
}
