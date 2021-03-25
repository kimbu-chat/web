import { IBaseAttachment } from '../../../models';

export interface IUploadAttachmentSuccessActionPayload<T = IBaseAttachment> {
  chatId: number;
  attachmentId: number;
  attachment: T;
}
