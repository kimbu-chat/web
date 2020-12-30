// TODO: Fix when server side will be done
export interface IMessagesReadIntegrationEvent {
  lastReadMessageId: number;
  chatId: number;
  userReaderId: number;
}
