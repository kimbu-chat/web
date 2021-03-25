export interface IMessagesReadIntegrationEvent {
  lastReadMessageId: number;
  chatId: number;
  userReaderId: number;
}
