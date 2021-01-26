import { MyProfileService } from 'app/services/my-profile-service';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IChatsState, MessageState } from '../../models';
import { getChatByIdDraftSelector } from '../../selectors';
import { IMessagesReadIntegrationEvent } from './messages-read-integration-event';

export class MessageReadEventHandler {
  static get action() {
    return createAction('MessagesRead')<IMessagesReadIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof MessageReadEventHandler.action>) => {
      // chat update
      const { lastReadMessageId, chatId, userReaderId } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.interlocutorLastReadMessageId = lastReadMessageId;

        if (chat.lastMessage?.id! <= lastReadMessageId) {
          chat.lastMessage!.state = MessageState.READ;
        }

        const profileService = new MyProfileService();
        const currentUserId = profileService.myProfile.id;

        if (userReaderId === currentUserId) {
          chat.unreadMessagesCount = 0;
        }

        draft.messages[chatId].messages.map((message) => {
          if (message.id <= lastReadMessageId) {
            message.state = MessageState.READ;
          }
          return message;
        });
      }

      return draft;
    });
  }
}