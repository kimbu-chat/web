import { BaseIntegrationEvent } from './base-integration-event';
import { UserPreview } from 'app/store/my-profile/models';

export interface ConferenceCreatedIntegrationEvent extends BaseIntegrationEvent {
  userCreator: UserPreview;
  name: string;
  memberIds: Array<number>;
  systemMessageId: number;
}
