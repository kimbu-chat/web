import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { ChatId } from '../../chat-id';
import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

import { IGroupChatEditedIntegrationEvent } from './group-chat-edited-integration-event';

export class GroupChatEditedEventHandler {
  static get action() {
    return createAction('GroupChatEdited')<IGroupChatEditedIntegrationEvent>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof GroupChatEditedEventHandler.action>) => {
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
      },
    );
  }
}
