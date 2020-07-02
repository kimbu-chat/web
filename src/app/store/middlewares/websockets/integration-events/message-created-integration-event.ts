import { BaseIntegrationEvent } from './base-integration-event';
import { UserPreview } from 'app/store/contacts/types';
import { SystemMessageType } from 'app/store/messages/interfaces';

export interface MessageCreatedIntegrationEvent extends BaseIntegrationEvent {
  destinationId: number;
  text: string;
  userCreator: UserPreview;
  destinationType: string;
  systemMessageType: SystemMessageType;
  attachments: Array<number>;
  userCreatorId: number;
}
