import { BaseIntegrationEvent } from './base-integration-event';

export interface CandidateIntegrationEvent extends BaseIntegrationEvent {
	candidate: RTCIceCandidate;
}
