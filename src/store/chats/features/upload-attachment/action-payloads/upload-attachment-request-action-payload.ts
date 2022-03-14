import { AttachmentType } from 'kimbu-models';

export interface IUploadAttachmentRequestActionPayload {
  chatId?: number;
  type: AttachmentType;
  attachmentId: number;
  file: File;
  waveFormJson?: string;
  noStateChange?: boolean;
}
