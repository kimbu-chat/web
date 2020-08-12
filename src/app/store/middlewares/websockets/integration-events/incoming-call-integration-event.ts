import { BaseIntegrationEvent } from './base-integration-event';
import { UserPreview } from 'app/store/my-profile/models';

export interface IncomingCallIntegrationEvent extends BaseIntegrationEvent {
	caller: UserPreview;
	offer: RTCSessionDescriptionInit;
}
