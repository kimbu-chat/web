import { UserStatus } from 'app/store/common/models';

export interface IStatusChangedIntegrationEvent {
  status: UserStatus;
  userId: number;
}
