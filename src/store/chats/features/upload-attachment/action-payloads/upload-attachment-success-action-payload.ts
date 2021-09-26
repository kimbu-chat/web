import { IAttachmentBase } from 'kimbu-models';

export interface IUploadAttachmentSuccessActionPayload<T = IAttachmentBase> {
  chatId: number;
  attachmentId: number;
  attachment: T;
}
