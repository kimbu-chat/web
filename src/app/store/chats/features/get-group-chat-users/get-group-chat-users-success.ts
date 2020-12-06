import { GetGroupChatUsersSuccessActionData } from 'app/store/friends/models';
import produce from 'immer';
import { unionBy } from 'lodash';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../../chats-utils';
import { ChatsState } from '../../models';

export class GetGroupChatUsersSuccess {
  static get action() {
    return createAction('GET_GROUP_CHAT_USERS_SUCCESS')<GetGroupChatUsersSuccessActionData>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof GetGroupChatUsersSuccess.action>) => {
      const { chatId, isFromSearch, isFromScroll, users } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (isFromSearch) {
        if (isFromScroll) {
          draft.chats[chatIndex].searchMembers = unionBy(draft.chats[chatIndex].searchMembers, users, 'id');
          return draft;
        }

        draft.chats[chatIndex].searchMembers = users;
        return draft;
      }

      draft.chats[chatIndex].members = users;
      draft.chats[chatIndex].searchMembers = undefined;

      return draft;
    });
  }
}
