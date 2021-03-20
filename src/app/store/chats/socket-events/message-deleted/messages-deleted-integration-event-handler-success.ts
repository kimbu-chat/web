import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IChatsState } from '@store/chats/chats-state';
import { FileType } from '../../models';
import { getChatByIdDraftSelector } from '../../selectors';
import { IMessagesDeletedIntegrationEventHandlerSuccessActionPayload } from './action-payloads/messages-deleted-integration-event-handler-success-action-payload';

export class MessagesDeletedIntegrationEventHandlerSuccess {
  static get action() {
    return createAction('MessagesDeletedSuccess')<IMessagesDeletedIntegrationEventHandlerSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof MessagesDeletedIntegrationEventHandlerSuccess.action>) => {
      const { chatId, messageIds, chatNewLastMessage } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        messageIds.forEach((msgIdToDelete) => {
          draft.selectedMessageIds = draft.selectedMessageIds.filter((id) => id !== msgIdToDelete);
          const messageIndex = draft.messages[chatId].messages.findIndex(({ id }) => id === msgIdToDelete);

          const [deletedMessage] = draft.messages[chatId].messages.splice(messageIndex, 1);

          deletedMessage?.attachments?.forEach((attachment) => {
            switch (attachment.type) {
              case FileType.Audio:
                chat.audioAttachmentsCount = (chat.audioAttachmentsCount || 1) - 1;
                chat.audios.audios = chat.audios.audios.filter(({ id }) => id !== attachment.id);

                break;
              case FileType.Picture:
                chat.pictureAttachmentsCount = (chat.pictureAttachmentsCount || 1) - 1;
                chat.photos.photos = chat.photos.photos.filter(({ id }) => id !== attachment.id);

                break;
              case FileType.Raw:
                chat.rawAttachmentsCount = (chat.rawAttachmentsCount || 1) - 1;
                chat.files.files = chat.files.files.filter(({ id }) => id !== attachment.id);

                break;
              case FileType.Video:
                chat.videoAttachmentsCount = (chat.videoAttachmentsCount || 1) - 1;
                chat.videos.videos = chat.videos.videos.filter(({ id }) => id !== attachment.id);

                break;
              case FileType.Voice:
                chat.voiceAttachmentsCount = (chat.voiceAttachmentsCount || 1) - 1;
                chat.recordings.recordings = chat.recordings.recordings.filter(({ id }) => id !== attachment.id);

                break;
              default:
                break;
            }
          });

          const linkedMessages = draft.messages[chatId].messages
            .filter(({ linkedMessage }) => linkedMessage?.id === msgIdToDelete)
            .map((message) => {
              if (message.linkedMessage) {
                return { ...message, linkedMessage: { ...message.linkedMessage, isDeleted: true } };
              }
              return message;
            });

          draft.messages[chatId].messages = linkedMessages;
        });

        if (chat.lastMessage) {
          if (messageIds.includes(chat.lastMessage.id)) {
            chat.lastMessage = draft.messages[chatId].messages[0] || chatNewLastMessage;
          }
        }

        if (chat.lastMessage?.linkedMessage) {
          if (messageIds.includes(chat.lastMessage?.linkedMessage?.id)) {
            chat.lastMessage.linkedMessage.isDeleted = true;
          }
        }
      }

      return draft;
    });
  }
}
