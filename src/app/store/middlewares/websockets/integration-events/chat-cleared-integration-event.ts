export interface IChatClearedIntegrationEvent {
  chatId: number;
  onlyForUserInitiator: boolean;
  userInitiatorId: number;
}
