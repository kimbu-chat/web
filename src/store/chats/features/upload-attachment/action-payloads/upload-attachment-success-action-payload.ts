import { IBaseAttachment } from '@store/chats/models';

export interface IUploadAttachmentSuccessActionPayload<T = IBaseAttachment> {
  chatId: number;
  attachmentId: number;
  attachment: T;
}
