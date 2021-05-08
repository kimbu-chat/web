import produce from 'immer';
import { createAction } from 'typesafe-actions';
import {
  FileType,
  IAudioAttachment,
  IPictureAttachment,
  IVideoAttachment,
  IVoiceAttachment,
} from '../../models';
import { getChatByIdDraftSelector } from '../../selectors';
import { ICreateMessageSuccessActionPayload } from './action-payloads/create-message-success-action-payload';
import { IChatsState } from '../../chats-state';

export class CreateMessageSuccess {
  static get action() {
    return createAction('CREATE_MESSAGE_SUCCESS')<ICreateMessageSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof CreateMessageSuccess.action>) => {
        const { messageState, chatId, oldMessageId, newMessageId, attachments } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);
        const chatMessages = draft.chats[chatId]?.messages;

        const message = chatMessages?.messages[oldMessageId];

        if (message && chatMessages) {
          message.id = newMessageId;
          message.state = messageState;
          chatMessages.messages[newMessageId] = message;
          delete chatMessages?.messages[oldMessageId];

          const messageIndex = chatMessages.messageIds.indexOf(oldMessageId);
          chatMessages.messageIds[messageIndex] = newMessageId;
        }

        if (chat) {
          if (chat.lastMessage?.id === oldMessageId) {
            const lastMessage = chat.lastMessage || { id: 0, state: '' };

            lastMessage.id = newMessageId;

            lastMessage.state = messageState;
          }

          attachments?.forEach((attachment) => {
            switch (attachment.type) {
              case FileType.Audio:
                chat.audioAttachmentsCount = (chat.audioAttachmentsCount || 0) + 1;
                chat.audios.audios.unshift({
                  ...(attachment as IAudioAttachment),
                  creationDateTime: new Date(),
                });

                break;
              case FileType.Picture:
                chat.pictureAttachmentsCount = (chat.pictureAttachmentsCount || 0) + 1;
                chat.photos.photos.unshift({
                  ...(attachment as IPictureAttachment),
                  creationDateTime: new Date(),
                });

                break;
              case FileType.Raw:
                chat.rawAttachmentsCount = (chat.rawAttachmentsCount || 0) + 1;
                chat.files.files.unshift({
                  ...attachment,
                  creationDateTime: new Date(),
                });

                break;
              case FileType.Video:
                chat.videoAttachmentsCount = (chat.videoAttachmentsCount || 0) + 1;
                chat.videos.videos.unshift({
                  ...(attachment as IVideoAttachment),
                  creationDateTime: new Date(),
                });

                break;
              case FileType.Voice:
                chat.voiceAttachmentsCount = (chat.voiceAttachmentsCount || 0) + 1;
                chat.recordings.recordings.unshift({
                  ...(attachment as IVoiceAttachment),
                  creationDateTime: new Date(),
                });

                break;
              default:
                break;
            }
          });
        }

        return draft;
      },
    );
  }
}
