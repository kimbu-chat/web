export interface DeleteMessageActionPayload {
  messageIds: number[];
  chatId: number;
  forEveryone: boolean;
}
