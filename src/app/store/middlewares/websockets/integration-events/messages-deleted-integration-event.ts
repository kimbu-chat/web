export interface IMessagesDeletedIntegrationEvent {
  chatId: number;
  messageIds: number[];
  userInitiatorId: number;
}
