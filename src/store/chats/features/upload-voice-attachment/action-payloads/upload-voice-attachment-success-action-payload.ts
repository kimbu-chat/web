export interface IUploadVoiceAttachmentSuccessActionPayload {
  oldId: number;
  chatId: string;
  attachmentId: number;
  attachmentUrl: string;
  oldAttachmentUrl: string;
  messageId: string;
}
