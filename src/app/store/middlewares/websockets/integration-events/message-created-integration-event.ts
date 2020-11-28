import { BaseAttachment } from 'store/chats/models';
import { UserPreview } from 'store/my-profile/models';
import { SystemMessageType } from '../../../messages/models';

export interface MessageCreatedIntegrationEvent {
  attachments: BaseAttachment[];
  chatId: number;
  creationDateTime: Date;
  id: number;
  systemMessageType: SystemMessageType;
  text: string;
  userCreator: UserPreview;
  userCreatorId: number;
}
