export interface MessagesDeletedIntegrationEvent {
  chatId: number;
  messageIds: number[];
  userInitiatorId: number;
}
