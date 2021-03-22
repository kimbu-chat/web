export interface IAttachmentToSend<T> {
  attachment: T;
  file: File;
  fileName: string;
  progress: number;
  success?: boolean;
  failure?: boolean;
  uploadedBytes?: number;
}
