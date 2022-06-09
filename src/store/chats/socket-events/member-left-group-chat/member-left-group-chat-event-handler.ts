import { createAction } from '@reduxjs/toolkit';

import { MyProfileService } from '@services/my-profile-service';

import { ChatId } from '../../chat-id';
import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IMemberLeftGroupChatIntegrationEvent {
  groupChatId: number;
  userId: number;
}

export class MemberLeftGroupChatEventHandler {
  static get action() {
    return createAction<IMemberLeftGroupChatIntegrationEvent>('MemberLeftGroupChat');
  }

  static get reducer() {
    return (
      draft: IChatsState,
      { payload }: ReturnType<typeof MemberLeftGroupChatEventHandler.action>,
    ) => {
      const { groupChatId, userId } = payload;

      const chatId = ChatId.from(undefined, groupChatId).id;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (!chat) {
        return draft;
      }

      const myId = new MyProfileService().myProfile.id;

      const isCurrentUserEventCreator = myId === userId;

      if (isCurrentUserEventCreator) {
        if (draft.selectedChatId === chatId) {
          draft.selectedChatId = undefined;
        }

        draft.chatList.chatIds = draft.chatList.chatIds.filter((id) => id !== chatId);

        delete draft.chats[chatId];
      } else {
        chat.members.memberIds = chat.members.memberIds.filter((id) => id !== userId);
        if (chat.groupChat) {
          chat.groupChat.membersCount -= 1;
        }
      }

      return draft;
    };
  }
}
