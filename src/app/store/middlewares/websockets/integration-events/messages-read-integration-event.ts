//TODO: Fix when server side will be done
export interface MessagesReadIntegrationEvent {
	lastReadMessageId: number;
	readMessagesCount: number;
	objectType: 'User' | 'GroupChat';
	userReaderId: number;
	groupChatId: number;
}
