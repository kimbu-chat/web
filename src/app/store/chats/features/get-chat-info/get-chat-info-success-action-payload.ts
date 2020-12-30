export interface IGetChatInfoSuccessActionPayload {
  chatId: number;
  rawAttachmentsCount: number;
  voiceAttachmentsCount: number;
  videoAttachmentsCount: number;
  audioAttachmentsCount: number;
  pictureAttachmentsCount: number;
}
