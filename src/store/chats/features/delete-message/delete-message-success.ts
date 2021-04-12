import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { FileType } from '../../models';
import { getChatByIdDraftSelector } from '../../selectors';
import { IDeleteMessageSuccessActionPayload } from './action-payloads/delete-message-success-action-payload';
import { IChatsState } from '../../chats-state';

export class DeleteMessageSuccess {
  static get action() {
    return createAction('DELETE_MESSAGE_SUCCESS')<IDeleteMessageSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof DeleteMessageSuccess.action>) => {
        const { chatId, messageIds } = payload;
        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          messageIds.forEach((msgIdToDelete) => {
            draft.selectedMessageIds = draft.selectedMessageIds.filter(
              (id) => id !== msgIdToDelete,
            );
            const messageIndex = draft.messages[chatId].messages.findIndex(
              ({ id }) => id === msgIdToDelete,
            );

            if (messageIndex === -1) {
              return;
            }

            const [deletedMessage] = draft.messages[chatId].messages.splice(messageIndex, 1);

            if (deletedMessage) {
              deletedMessage.attachments?.forEach((attachment) => {
                switch (attachment.type) {
                  case FileType.Audio:
                    chat.audioAttachmentsCount = (chat.audioAttachmentsCount || 1) - 1;
                    chat.audios.audios = chat.audios.audios.filter(
                      ({ id }) => id !== attachment.id,
                    );

                    break;
                  case FileType.Picture:
                    chat.pictureAttachmentsCount = (chat.pictureAttachmentsCount || 1) - 1;
                    chat.photos.photos = chat.photos.photos.filter(
                      ({ id }) => id !== attachment.id,
                    );

                    break;
                  case FileType.Raw:
                    chat.rawAttachmentsCount = (chat.rawAttachmentsCount || 1) - 1;
                    chat.files.files = chat.files.files.filter(({ id }) => id !== attachment.id);

                    break;
                  case FileType.Video:
                    chat.videoAttachmentsCount = (chat.videoAttachmentsCount || 1) - 1;
                    chat.videos.videos = chat.videos.videos.filter(
                      ({ id }) => id !== attachment.id,
                    );

                    break;
                  case FileType.Voice:
                    chat.voiceAttachmentsCount = (chat.voiceAttachmentsCount || 1) - 1;
                    chat.recordings.recordings = chat.recordings.recordings.filter(
                      ({ id }) => id !== attachment.id,
                    );

                    break;
                  default:
                    break;
                }
              });
            }

            draft.messages[chatId].messages = draft.messages[chatId].messages.map((msg) => {
              if (msg.linkedMessage?.id === msgIdToDelete) {
                return {
                  ...msg,
                  linkedMessage: {
                    ...msg.linkedMessage,
                    isDeleted: true,
                  },
                };
              }
              return msg;
            });
          });

          if (chat.lastMessage?.id && messageIds.includes(chat.lastMessage.id)) {
            [chat.lastMessage] = draft.messages[chatId].messages;
          }
        }

        return draft;
      },
    );
  }
}
