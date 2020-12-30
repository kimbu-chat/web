import { IStatusChangedIntegrationEvent } from 'app/store/middlewares/websockets/integration-events/status-changed-integration-event';

export interface IUserStatusChangedEventActionPayload extends IStatusChangedIntegrationEvent {}
