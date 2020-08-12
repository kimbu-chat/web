import { BaseIntegrationEvent } from './base-integration-event';
import { UserPreview } from 'app/store/my-profile/models';

export interface InterlocutorAcceptedCallIntegrationEvent extends BaseIntegrationEvent {
	interlocutor: UserPreview;
	answer: RTCSessionDescriptionInit;
}
