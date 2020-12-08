import { FileType } from 'app/store/messages/models';

export interface UploadAttachmentRequestActionPayload {
  chatId: number;
  type: FileType;
  attachmentId: number;
  file: File;
}
