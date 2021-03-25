import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { FileType, IAudioAttachment, IPictureAttachment, IRawAttachment, IVideoAttachment, IVoiceAttachment } from '../../models';
import { ISumbitEditMessageSuccessActionPayload } from './action-payloads/sumbit-edit-message-success-action-payload';
import { getChatByIdDraftSelector } from '../../selectors';
import { IChatsState } from '../../chats-state';

export class SubmitEditMessageSuccess {
  static get action() {
    return createAction('SUBMIT_EDIT_MESSAGE_SUCCESS')<ISumbitEditMessageSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof SubmitEditMessageSuccess.action>) => {
      const { chatId, messageId } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);
      const message = draft.messages[chatId].messages.find(({ id }) => id === messageId);
      const newAttachments = [
        ...(message?.attachments?.filter(({ id }) => payload.removedAttachments?.findIndex((removedAttachment) => removedAttachment.id === id) === -1) || []),
        ...(payload.newAttachments || []),
      ];

      if (message) {
        message.text = payload.text;
        message.isEdited = true;
        message.attachments = newAttachments;
      }

      draft.messages[chatId].messages = draft.messages[chatId].messages.map((msg) => {
        if (msg.linkedMessage?.id === messageId) {
          return {
            ...msg,
            linkedMessage: {
              ...msg.linkedMessage,
              text: payload.text,
              attachments: newAttachments,
            },
          };
        }

        return msg;
      });

      if (chat) {
        payload.removedAttachments?.forEach((attachment) => {
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
