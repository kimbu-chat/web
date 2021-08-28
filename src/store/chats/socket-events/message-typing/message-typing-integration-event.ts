export interface IIntercolutorMessageTypingIntegrationEvent {
  text: string;
  timeoutId: NodeJS.Timeout;
  interlocutorName: string;
  interlocutorId: string;
  chatId: string;
}
