import produce from 'immer';
import { unionBy } from 'lodash';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../../chats-utils';
import { ChatsState } from '../../models';
import { GetGroupChatUsersSuccessActionPayload } from './get-group-chat-users-success-action-payload';

export class GetGroupChatUsersSuccess {
  static get action() {
    return createAction('GET_GROUP_CHAT_USERS_SUCCESS')<GetGroupChatUsersSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof GetGroupChatUsersSuccess.action>) => {
      const { chatId, isFromSearch, isFromScroll, users, hasMore } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      draft.chats[chatIndex].members.hasMore = hasMore;

      if (isFromSearch) {
        if (isFromScroll) {
          draft.chats[chatIndex].members.searchMembers = unionBy(draft.chats[chatIndex].members.searchMembers, users, 'id');
          return draft;
        }

        draft.chats[chatIndex].members.searchMembers = users;
        return draft;
      }

      if (!isFromSearch) {
        draft.chats[chatIndex].members.searchMembers = [];
        draft.chats[chatIndex].members.members = unionBy(draft.chats[chatIndex].members.members, users, 'id');
        return draft;
      }

      return draft;
    });
  }
}
