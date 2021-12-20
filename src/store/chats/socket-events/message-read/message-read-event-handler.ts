import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { MessageState } from '@store/chats/models';

import { MyProfileService } from '../../../../services/my-profile-service';
import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

import { IMessagesReadIntegrationEvent } from './messages-read-integration-event';

export class MessageReadEventHandler {
  static get action() {
    return createAction('MessagesRead')<IMessagesReadIntegrationEvent>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof MessageReadEventHandler.action>) => {
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
      },
    );
  }
}
