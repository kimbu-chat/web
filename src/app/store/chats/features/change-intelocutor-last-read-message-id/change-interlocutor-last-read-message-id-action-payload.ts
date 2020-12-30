import { IMessagesReadIntegrationEvent } from 'app/store/middlewares/websockets/integration-events/messages-read-integration-event';

export interface IChangeInterlocutorLastReadMessageIdActionPayload extends IMessagesReadIntegrationEvent {}
