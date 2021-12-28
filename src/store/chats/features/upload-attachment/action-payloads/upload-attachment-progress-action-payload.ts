export interface IUploadAttachmentProgressActionPayload {
  chatId: number;
  attachmentId: number;
  progress: number;
  uploadedBytes: number;
  draftId: number;
}
