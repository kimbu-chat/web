import { createAction } from '@reduxjs/toolkit';

import { ChatId } from '@store/chats/chat-id';
import { IChatsState } from '@store/chats/chats-state';
import { getChatByIdDraftSelector } from '@store/chats/selectors';

export interface IRemoveUserFromGroupChatSuccessActionPayload {
  userId: number;
  groupChatId: number;
}

export class RemoveUserFromGroupChatSuccess {
  static get action() {
    return createAction<IRemoveUserFromGroupChatSuccessActionPayload>(
      'REMOVE_USER_FROM_GROUP_CHAT_SUCCESS',
    );
  }

  static get reducer() {
    return (
        draft: IChatsState,
        { payload }: ReturnType<typeof RemoveUserFromGroupChatSuccess.action>,
      ) => {
        const { userId, groupChatId } = payload;

        const chatId = ChatId.from(undefined, groupChatId).id;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat?.groupChat) {
          // chat.groupChat.membersCount is decremented in event handler
          chat.members.memberIds = chat.members.memberIds.filter((id) => id !== userId);
        }

        return draft;
      };
  }
}
