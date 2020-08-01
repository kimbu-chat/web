import { BaseIntegrationEvent } from './base-integration-event';

export interface IntercolutorMessageTypingIntegrationEvent extends BaseIntegrationEvent {
	isConference: boolean;
	text: string;
	timeoutId: any;
	interlocutorId: number;
}
