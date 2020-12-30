export interface IDeleteMessageActionPayload {
  messageIds: number[];
  chatId: number;
  forEveryone: boolean;
}
