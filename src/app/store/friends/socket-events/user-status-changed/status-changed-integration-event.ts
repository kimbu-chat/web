import { UserStatus } from '../../../common/models';

export interface IStatusChangedIntegrationEvent {
  status: UserStatus;
  userId: number;
}
