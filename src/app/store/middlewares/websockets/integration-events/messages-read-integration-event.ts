import { BaseIntegrationEvent } from './base-integration-event';

export interface MessagesReadIntegrationEvent extends BaseIntegrationEvent {
  lastReadMessageId: number;
  readMessagesCount: number;
  userReaderId: number;
  conferenceId: number;
}
