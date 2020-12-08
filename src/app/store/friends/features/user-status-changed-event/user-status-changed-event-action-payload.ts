import { StatusChangedIntegrationEvent } from 'app/store/middlewares/websockets/integration-events/status-changed-integration-event';

export interface UserStatusChangedEventActionPayload extends StatusChangedIntegrationEvent {}
