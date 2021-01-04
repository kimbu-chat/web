import { IBaseAttachment, SystemMessageType } from 'store/chats/models';
import { IUserPreview } from 'store/my-profile/models';

export interface IMessageCreatedIntegrationEvent {
  attachments?: IBaseAttachment[];
  chatId: number;
  creationDateTime: Date;
  id: number;
  systemMessageType: SystemMessageType;
  text: string;
  userCreator: IUserPreview;
}
