import { IAttachmentBase } from 'kimbu-models';

export interface IUploadAttachmentSuccessActionPayload<T = IAttachmentBase> {
  chatId: string;
  attachmentId: number;
  attachment: T;
}
