import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IGetGroupChatUsersSuccessActionPayload {
  chatId: number;
  isFromSearch?: boolean;
  hasMore: boolean;
  userIds: number[];
}

export class GetGroupChatUsersSuccess {
  static get action() {
    return createAction<IGetGroupChatUsersSuccessActionPayload>('GET_GROUP_CHAT_USERS_SUCCESS');
  }

  static get reducer() {
    return (
      draft: IChatsState,
      { payload }: ReturnType<typeof GetGroupChatUsersSuccess.action>,
    ) => {
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
    };
  }
}
