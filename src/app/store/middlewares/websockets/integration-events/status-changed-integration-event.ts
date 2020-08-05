import { BaseIntegrationEvent } from './base-integration-event';
import { UserStatus } from 'app/store/friends/models';

export interface StatusChangedIntegrationEvent extends BaseIntegrationEvent {
	status: UserStatus;
}
