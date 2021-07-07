import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

import { IGetGroupChatUsersSuccessActionPayload } from './action-payloads/get-group-chat-users-success-action-payload';

export class GetGroupChatUsersSuccess {
  static get action() {
    return createAction('GET_GROUP_CHAT_USERS_SUCCESS')<IGetGroupChatUsersSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof GetGroupChatUsersSuccess.action>) => {
        const { chatId, isFromSearch, userIds, hasMore } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          chat.members.hasMore = hasMore;
          chat.members.loading = false;

          if (isFromSearch) {
            chat.members.memberIds = userIds;
          }

          if (!isFromSearch) {
            chat.members.memberIds = [...new Set([...chat.members.memberIds, ...userIds])];
          }
        }

        return draft;
      },
    );
  }
}
