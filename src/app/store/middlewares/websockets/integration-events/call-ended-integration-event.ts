import { BaseIntegrationEvent } from './base-integration-event';
import { UserPreview } from 'app/store/my-profile/models';

export interface CallEndedIntegrationEvent extends BaseIntegrationEvent {
	interlocutor: UserPreview;
}
