import { UserStatus } from 'app/store/models';

export interface IStatusChangedIntegrationEvent {
  status: UserStatus;
  userId: number;
}
