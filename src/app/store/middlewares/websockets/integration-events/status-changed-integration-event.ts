import { BaseIntegrationEvent } from './base-integration-event';
import { UserStatus } from 'app/store/contacts/types';

export interface StatusChangedIntegrationEvent extends BaseIntegrationEvent {
  status: UserStatus;
}
