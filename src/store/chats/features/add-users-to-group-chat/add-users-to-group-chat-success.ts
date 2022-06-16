import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IAddUsersToGroupChatSuccessActionPayload {
  userIds: number[];
  chatId: number;
}

export class AddUsersToGroupChatSuccess {
  static get action() {
    return createAction<IAddUsersToGroupChatSuccessActionPayload>(
      'ADD_USERS_TO_GROUP_CHAT_SUCCESS',
    );
  }

  static get reducer() {
    return (
      draft: IChatsState,
      { payload }: ReturnType<typeof AddUsersToGroupChatSuccess.action>,
    ) => {
      const { chatId, userIds } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat?.groupChat) {
        chat.groupChat.membersCount += userIds.length;
        chat.members.memberIds = [...new Set([...chat.members.memberIds, ...userIds])];
      }

      return draft;
    };
  }
}
