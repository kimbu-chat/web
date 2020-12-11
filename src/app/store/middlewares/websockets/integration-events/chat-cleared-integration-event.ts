export interface ChatClearedIntegrationEvent {
  chatId: number;
  onlyForUserInitiator: boolean;
  userInitiatorId: number;
}
