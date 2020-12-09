import { MessagesReadIntegrationEvent } from 'app/store/middlewares/websockets/integration-events/messages-read-integration-event';

export interface ChangeInterlocutorLastReadMessageIdActionPayload extends MessagesReadIntegrationEvent {}
