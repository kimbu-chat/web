export interface IStatusChangedIntegrationEvent {
  online: boolean;
  userId: string;
  lastOnlineTime: string;
}
