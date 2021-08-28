export interface IUploadAttachmentProgressActionPayload {
  chatId: string;
  attachmentId: number;
  progress: number;
  uploadedBytes: number;
}
