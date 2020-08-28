import { BaseIntegrationEvent } from './base-integration-event';

export interface InterlocutorAcceptedCallIntegrationEvent extends BaseIntegrationEvent {
	answer: RTCSessionDescriptionInit;
	isVideoEnabled: boolean;
}
