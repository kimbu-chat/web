export interface IDeleteMessageSuccessActionPayload {
  messageIds: number[];
  chatId: number;
  forEveryone: boolean;
}
