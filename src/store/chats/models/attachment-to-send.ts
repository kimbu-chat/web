export interface IAttachmentToSend<T> {
  attachment: T;
  file: File;
  progress: number;
  success?: boolean;
  failure?: boolean;
  uploadedBytes?: number;
  waveFormJson?: string;
}
