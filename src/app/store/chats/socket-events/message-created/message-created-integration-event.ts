import { IBaseAttachment, SystemMessageType } from 'store/chats/models';
import { IUserPreview } from 'app/store/models';

export interface IMessageCreatedIntegrationEvent {
  attachments?: IBaseAttachment[];
  chatId: number;
  creationDateTime: Date;
  id: number;
  systemMessageType: SystemMessageType;
  text: string;
  userCreator: IUserPreview;
  replyToMessageId: number;
  replyMessage?: {
    id: number;
    userCreatorFullName: string;
    text: string;
  };
}
