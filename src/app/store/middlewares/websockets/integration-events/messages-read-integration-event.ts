export interface MessagesReadIntegrationEvent {
	lastReadMessageId: number;
	readMessagesCount: number;
	objectType: 'User' | 'GroupChat';
	userReaderId: number;
	groupChatId: number;
}
