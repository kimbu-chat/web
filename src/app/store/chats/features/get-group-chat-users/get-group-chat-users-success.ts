import produce from 'immer';
import { unionBy } from 'lodash';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IGetGroupChatUsersSuccessActionPayload } from './get-group-chat-users-success-action-payload';

export class GetGroupChatUsersSuccess {
  static get action() {
    return createAction('GET_GROUP_CHAT_USERS_SUCCESS')<IGetGroupChatUsersSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetGroupChatUsersSuccess.action>) => {
      const { chatId, isFromSearch, isFromScroll, users, hasMore } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.members.hasMore = hasMore;
        chat.members.loading = false;

        if (isFromSearch) {
          if (isFromScroll) {
            chat.members.searchMembers = unionBy(chat.members.searchMembers, users, 'id');
            return draft;
          }

          chat.members.searchMembers = users;
          return draft;
        }

        if (!isFromSearch) {
          chat.members.searchMembers = [];
          chat.members.members = unionBy(chat.members.members, users, 'id');
          return draft;
        }
      }

      return draft;
    });
  }
}
