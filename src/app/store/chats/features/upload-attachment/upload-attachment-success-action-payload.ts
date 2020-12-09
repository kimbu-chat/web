import { BaseAttachment } from '../../models';

export interface UploadAttachmentSuccessActionPayload<T = BaseAttachment> {
  chatId: number;
  attachmentId: number;
  attachment: T;
}
