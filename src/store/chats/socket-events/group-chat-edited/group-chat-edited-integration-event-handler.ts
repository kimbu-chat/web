import { createAction } from '@reduxjs/toolkit';

import { ChatId } from '../../chat-id';
import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IGroupChatEditedIntegrationEvent {
  avatarId: number;
  avatarPreviewUrl: string;
  avatarUrl: string;
  description: string;
  name: string;
  id: number;
}

export class GroupChatEditedEventHandler {
  static get action() {
    return createAction<IGroupChatEditedIntegrationEvent>('GroupChatEdited');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof GroupChatEditedEventHandler.action>) => {
        const { avatarId, avatarPreviewUrl, avatarUrl, description, name, id } = payload;

        const chatId = ChatId.from(undefined, id).id;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat && chat.groupChat) {
          chat.groupChat.name = name;
          chat.groupChat.description = description;

          if (chat.groupChat.avatar?.id !== avatarId) {
            chat.groupChat.avatar = {
              url: avatarUrl,
              previewUrl: avatarPreviewUrl,
              id: avatarId,
            };
          }
        }

        return draft;
      };
  }
}
