import { BaseIntegrationEvent } from './base-integration-event';

export interface MessagesReadIntegrationEvent extends BaseIntegrationEvent {
	lastReadMessageId: number;
	readMessagesCount: number;
	objectType: 'User' | 'GroupChat';
	userReaderId: number;
	groupChatId: number;
}
