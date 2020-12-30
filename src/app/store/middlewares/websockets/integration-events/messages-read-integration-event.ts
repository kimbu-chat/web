// TODO: Fix when server side will be done
export interface IMessagesReadIntegrationEvent {
  lastReadMessageId: number;
  readMessagesCount: number;
  chatId: number;
}
