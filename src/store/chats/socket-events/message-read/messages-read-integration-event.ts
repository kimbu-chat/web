export interface IMessagesReadIntegrationEvent {
  lastReadMessageId: string;
  chatId: string;
  userReaderId: string;
}
