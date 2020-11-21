export interface IntercolutorMessageTypingIntegrationEvent {
	text: string;
	timeoutId: NodeJS.Timeout;
	interlocutorName: string;
	interlocutorId: number;
	chatId: number;
}
