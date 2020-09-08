import { BaseIntegrationEvent } from './base-integration-event';

export interface MessagesReadIntegrationEvent extends BaseIntegrationEvent {
	lastReadMessageId: number;
	readMessagesCount: number;
	objectType: 'User' | 'Conference';
	userReaderId: number;
	conferenceId: number;
}
