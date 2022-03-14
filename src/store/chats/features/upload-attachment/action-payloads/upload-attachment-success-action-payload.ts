import { IAttachmentBase } from 'kimbu-models';

export interface IUploadAttachmentSuccessActionPayload<T = IAttachmentBase> {
  draftId: number;
  chatId: number;
  attachmentId: number;
  attachment: T;
}
