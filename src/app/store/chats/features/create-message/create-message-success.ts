import { FileType, IAudioAttachment, IChatsState, IPictureAttachment, IRawAttachment, IVideoAttachment, IVoiceAttachment } from 'store/chats/models';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from '../../selectors';
import { ICreateMessageSuccessActionPayload } from './action-payloads/create-message-success-action-payload';

export class CreateMessageSuccess {
  static get action() {
    return createAction('CREATE_MESSAGE_SUCCESS')<ICreateMessageSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof CreateMessageSuccess.action>) => {
      const { messageState, chatId, oldMessageId, newMessageId, attachments } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      const message = draft.messages[chatId].messages.find(({ id }) => id === oldMessageId);

      if (message) {
        message.id = newMessageId;
        message.state = messageState;
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
                ...(attachment as IRawAttachment),
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
    });
  }
}
