import { BaseIntegrationEvent } from './base-integration-event';

export interface IntercolutorMessageTypingIntegrationEvent extends BaseIntegrationEvent {
	text: string;
	timeoutId: NodeJS.Timeout;
	interlocutorName: string;
	interlocutorId: number;
	chatId: number;
}
