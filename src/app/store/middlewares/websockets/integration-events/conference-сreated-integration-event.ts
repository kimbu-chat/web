import { BaseIntegrationEvent } from './base-integration-event';
import { UserPreview } from 'app/store/contacts/types';

export interface ConferenceCreatedIntegrationEvent extends BaseIntegrationEvent {
  userCreator: UserPreview;
  name: string;
  memberIds: Array<number>;
  systemMessageId: number;
}
