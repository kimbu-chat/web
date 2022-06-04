import { createAction } from '@reduxjs/toolkit';

import { MessageState } from '@store/chats/models';

import { MyProfileService } from '../../../../services/my-profile-service';
import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IMessagesReadIntegrationEvent {
  lastReadMessageId: number;
  chatId: number;
  userReaderId: number;
}


export class MessageReadEventHandler {
  static get action() {
    return createAction<IMessagesReadIntegrationEvent>('MessagesRead');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof MessageReadEventHandler.action>) => {
        // chat update
        const { lastReadMessageId, chatId, userReaderId } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          chat.interlocutorLastReadMessageId = lastReadMessageId;

          const profileService = new MyProfileService();
          const currentUserId = profileService.myProfile.id;

          if (userReaderId === currentUserId) {
            chat.unreadMessagesCount = 0;
          }

          draft.chats[chatId]?.messages.messageIds.forEach((messageId) => {
            const message = draft.chats[chatId]?.messages.messages[messageId];
            if (message && messageId <= lastReadMessageId) {
              message.state = MessageState.READ;
            }
          });
        }

        return draft;
      };
  }
}
