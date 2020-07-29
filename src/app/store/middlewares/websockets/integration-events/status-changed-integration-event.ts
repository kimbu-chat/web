import { BaseIntegrationEvent } from './base-integration-event';
import { UserStatus } from 'app/store/my-profile/models';

export interface StatusChangedIntegrationEvent extends BaseIntegrationEvent {
  status: UserStatus;
}
