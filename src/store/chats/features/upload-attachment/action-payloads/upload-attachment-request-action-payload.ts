import { AttachmentType } from 'kimbu-models';

export interface IUploadAttachmentRequestActionPayload {
  type: AttachmentType;
  attachmentId: number;
  file: File;
  waveFormJson?: string;
}
