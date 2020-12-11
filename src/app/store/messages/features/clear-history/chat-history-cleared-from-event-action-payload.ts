import { ChatClearedIntegrationEvent } from 'app/store/middlewares/websockets/integration-events/chat-cleared-integration-event';

export interface ChatHistoryClearedFromEventActionPayload extends ChatClearedIntegrationEvent {}
