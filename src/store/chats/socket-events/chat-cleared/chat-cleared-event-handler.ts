import { createAction } from '@reduxjs/toolkit';

import { MyProfileService } from '../../../../services/my-profile-service';
import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IChatClearedIntegrationEvent {
  chatId: number;
  onlyForUserInitiator: boolean;
  userInitiatorId: number;
}

export class ChatClearedEventHandler {
  static get action() {
    return createAction<IChatClearedIntegrationEvent>('ChatCleared');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof ChatClearedEventHandler.action>) => {
      const { chatId, onlyForUserInitiator, userInitiatorId } = payload;

      const myId = new MyProfileService().myProfile.id;

      if (!onlyForUserInitiator || myId === userInitiatorId) {
        const chat = getChatByIdDraftSelector(chatId, draft);

        if (!chat) {
          return draft;
        }

        chat.unreadMessagesCount = 0;

        const chatMessages = chat.messages;

        if (chatMessages && chatMessages.messageIds.length !== 0) {
          chatMessages.messages = {};
          chatMessages.messageIds = [];
          chatMessages.hasMore = false;

          if (chat) {
            chat.lastMessageId = undefined;
          }
        }
      }

      return draft;
    };
  }
}
