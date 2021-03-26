import produce from 'immer';
import { unionBy } from 'lodash';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from '../../selectors';
import { IGetGroupChatUsersSuccessActionPayload } from './action-payloads/get-group-chat-users-success-action-payload';
import { IChatsState } from '../../chats-state';

export class GetGroupChatUsersSuccess {
  static get action() {
    return createAction('GET_GROUP_CHAT_USERS_SUCCESS')<IGetGroupChatUsersSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof GetGroupChatUsersSuccess.action>) => {
        const { chatId, isFromSearch, users, hasMore } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          chat.members.hasMore = hasMore;
          chat.members.loading = false;

          if (isFromSearch) {
            chat.members.members = users;
          }

          if (!isFromSearch) {
            chat.members.members = unionBy(chat.members.members, users, 'id');
          }
        }

        return draft;
      },
    );
  }
}
