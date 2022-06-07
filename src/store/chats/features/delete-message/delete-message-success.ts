import { createAction } from '@reduxjs/toolkit';
import { AttachmentType } from 'kimbu-models';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IDeleteMessageSuccessActionPayload {
  messageIds: number[];
  chatId: number;
}

export class DeleteMessageSuccess {
  static get action() {
    return createAction<IDeleteMessageSuccessActionPayload>('DELETE_MESSAGE_SUCCESS');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof DeleteMessageSuccess.action>) => {
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
                case AttachmentType.Audio:
                  chat.audioAttachmentsCount = (chat.audioAttachmentsCount || 1) - 1;
                  chat.audios.data = chat.audios.data.filter(({ id }) => id !== attachment.id);

                  break;
                case AttachmentType.Picture:
                  chat.pictureAttachmentsCount = (chat.pictureAttachmentsCount || 1) - 1;
                  chat.photos.data = chat.photos.data.filter(({ id }) => id !== attachment.id);

                  break;
                case AttachmentType.Raw:
                  chat.rawAttachmentsCount = (chat.rawAttachmentsCount || 1) - 1;
                  chat.files.data = chat.files.data.filter(({ id }) => id !== attachment.id);

                  break;
                case AttachmentType.Video:
                  chat.videoAttachmentsCount = (chat.videoAttachmentsCount || 1) - 1;
                  chat.videos.data = chat.videos.data.filter(({ id }) => id !== attachment.id);

                  break;
                case AttachmentType.Voice:
                  chat.voiceAttachmentsCount = (chat.voiceAttachmentsCount || 1) - 1;
                  chat.recordings.data = chat.recordings.data.filter(
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

        if (messageIds.includes(draft.chats[chatId]?.lastMessageId || -1) && newLastMessage) {
          chat.lastMessageId = newLastMessage.id;
        }
      }

      // TODO: handle user deleteing

      return draft;
    };
  }
}
