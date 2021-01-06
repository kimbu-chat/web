import { FileType, IAudioAttachment, IChatsState, IPictureAttachment, IRawAttachment, IVideoAttachment, IVoiceAttachment } from 'store/chats/models';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { ISumbitEditMessageSuccessActionPayload } from './action-payloads/sumbit-edit-message-success-action-payload';
import { getChatByIdDraftSelector } from '../../selectors';

export class SubmitEditMessageSuccess {
  static get action() {
    return createAction('SUBMIT_EDIT_MESSAGE_SUCCESS')<ISumbitEditMessageSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof SubmitEditMessageSuccess.action>) => {
      const { chatId, messageId } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);
      const message = chat?.messages.messages.find(({ id }) => id === messageId);

      if (message) {
        message.text = payload.text;
        message.isEdited = true;
        message.attachments = [
          ...(message.attachments?.filter(({ id }) => payload.removedAttachments?.findIndex((removedAttachment) => removedAttachment.id === id) === -1) || []),
          ...(payload.newAttachments || []),
        ];
      }

      if (chat) {
        payload.removedAttachments?.forEach((attachment) => {
          console.log(attachment.id);
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

        payload.newAttachments?.forEach((attachment) => {
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
