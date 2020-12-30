import { FileType } from 'app/store/messages/models';

export interface IUploadAttachmentRequestActionPayload {
  chatId: number;
  type: FileType;
  attachmentId: number;
  file: File;
}
