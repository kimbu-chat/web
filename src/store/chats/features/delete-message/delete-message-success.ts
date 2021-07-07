import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IChatsState } from '../../chats-state';
import { FileType } from '../../models';
import { getChatByIdDraftSelector } from '../../selectors';

import { IDeleteMessageSuccessActionPayload } from './action-payloads/delete-message-success-action-payload';

export class DeleteMessageSuccess {
  static get action() {
    return createAction('DELETE_MESSAGE_SUCCESS')<IDeleteMessageSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof DeleteMessageSuccess.action>) => {
        const { chatId, messageIds } = payload;
        const chat = getChatByIdDraftSelector(chatId, draft);
        const messagesForChat = draft.chats[chatId]?.messages;

        if (chat) {
          messageIds.forEach((msgIdToDelete) => {
            draft.selectedMessageIds = draft.selectedMessageIds.filter(
              (id) => id !== msgIdToDelete,
            );

            if (messagesForChat) {
              messagesForChat.messageIds = messagesForChat.messageIds.filter(
                (msgId) => msgIdToDelete !== msgId,
              );
            }

            const deletedMessage = messagesForChat?.messages[msgIdToDelete];

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

              delete messagesForChat?.messages[msgIdToDelete];
            }
          });

          const newLastMessage = messagesForChat?.messages[messagesForChat?.messageIds[0] || -1];

          if (messageIds.includes(draft.chats[chatId]?.lastMessage?.id || -1) && newLastMessage) {
            chat.lastMessage = newLastMessage;
          }
        }

        // TODO: handle user deleteing

        return draft;
      },
    );
  }
}
