import { InterlocutorType } from 'app/store/chats/models';
import { BaseIntegrationEvent } from './base-integration-event';

export interface IntercolutorMessageTypingIntegrationEvent extends BaseIntegrationEvent {
	text: string;
	timeoutId: NodeJS.Timeout;
	objectId: number;
	interlocutorName: string;
	chatId: {
		interlocutorType: InterlocutorType;
		userId?: number;
		conferenceId?: number;
	};
}
