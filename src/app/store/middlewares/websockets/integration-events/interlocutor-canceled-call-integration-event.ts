import { BaseIntegrationEvent } from './base-integration-event';
import { UserPreview } from 'app/store/my-profile/models';

export interface InterlocutorCanceledCallIntegrationEvent extends BaseIntegrationEvent {
	interlocutor: UserPreview;
}
