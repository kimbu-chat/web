export interface IChatClearedIntegrationEvent {
  chatId: string;
  onlyForUserInitiator: boolean;
  userInitiatorId: string;
}
