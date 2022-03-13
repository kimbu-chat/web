import { AttachmentType } from 'kimbu-models';

export interface IAttachmentToSend {
  id: number;
  byteSize: number;
  type: AttachmentType;
  file: File;
  progress: number;
  success?: boolean;
  failure?: boolean;
  uploadedBytes?: number;
  waveFormJson?: string;
}
