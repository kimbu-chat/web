export interface IUploadAttachmentProgressActionPayload {
  draftId: number;
  chatId: number;
  attachmentId: number;
  progress: number;
  uploadedBytes: number;
}
