export interface IUploadVoiceAttachmentSuccessActionPayload {
  oldId: number;
  chatId: number;
  attachmentId: number;
  attachmentUrl: string;
  oldAttachmentUrl: string;
  messageId: number;
}
