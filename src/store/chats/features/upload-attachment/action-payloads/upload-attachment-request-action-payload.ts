import { FileType } from '../../../models';

export interface IUploadAttachmentRequestActionPayload {
  type: FileType;
  attachmentId: number;
  file: File;
  waveFormJson?: string;
}
