export interface IAttachmentToSend<T> {
  attachment: T;
  file: File;
  uploadedBytes?: number;
  fileName: string;
  progress: number;
  success?: boolean;
  failure?: boolean;
}
