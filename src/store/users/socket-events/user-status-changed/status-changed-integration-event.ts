export interface IStatusChangedIntegrationEvent {
  online: boolean;
  userId: number;
  lastOnlineTime: Date;
}
