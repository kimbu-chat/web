import { IBaseAttachment } from 'store/chats/models';
import { IUserPreview } from 'store/my-profile/models';
import { SystemMessageType } from 'store/messages/models';

export interface IMessageCreatedIntegrationEvent {
  attachments?: IBaseAttachment[];
  chatId: number;
  creationDateTime: Date;
  id: number;
  systemMessageType: SystemMessageType;
  text: string;
  userCreator: IUserPreview;
}
