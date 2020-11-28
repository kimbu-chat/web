import { UserStatus } from 'app/store/common/models';

export interface StatusChangedIntegrationEvent {
  status: UserStatus;
  userId: number;
}
