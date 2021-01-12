import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { FileType, IChatsState } from '../../models';
import { getChatByIdDraftSelector } from '../../selectors';
import { IMessagesDeletedIntegrationEvent } from './messages-deleted-integration-event';

export class MessagesDeletedIntegrationEventHandler {
  static get action() {
    return createAction('MessagesDeleted')<IMessagesDeletedIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof MessagesDeletedIntegrationEventHandler.action>) => {
      const { chatId, messageIds } = payload;
      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        messageIds.forEach((msgIdToDelete) => {
          draft.selectedMessageIds = draft.selectedMessageIds.filter((id) => id !== msgIdToDelete);
          const messageIndex = chat.messages.messages.findIndex(({ id }) => id === msgIdToDelete);
          const [deletedMessage] = chat.messages.messages.splice(messageIndex, 1);

          deletedMessage.attachments?.forEach((attachment) => {
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

          const repliedMessages = chat?.messages.messages.filter(({ linkedMessage }) => linkedMessage?.id === msgIdToDelete);

          repliedMessages?.forEach((message) => {
            if (message.linkedMessage) {
              message.linkedMessage = null;
            }
          });
        });

        if (chat.lastMessage?.id && messageIds.includes(chat.lastMessage.id)) {
          [chat.lastMessage] = chat.messages.messages;
        }
      }

      return draft;
    });
  }
}
