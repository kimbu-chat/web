export interface IMessagesReadIntegrationEvent {
  lastReadMessageId: string;
  chatId: number;
  userReaderId: number;
}
