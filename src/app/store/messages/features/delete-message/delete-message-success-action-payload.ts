export interface DeleteMessageSuccessActionPayload {
  messageIds: number[];
  chatId: number;
  forEveryone: boolean;
}
