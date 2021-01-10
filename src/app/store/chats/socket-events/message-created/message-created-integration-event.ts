import { IBaseAttachment, SystemMessageType } from 'store/chats/models';
import { IUserPreview } from 'app/store/models';
import { MessageLinkType } from '../../models/linked-message-type';

export interface IMessageCreatedIntegrationEvent {
  attachments?: IBaseAttachment[];
  chatId: number;
  creationDateTime: Date;
  id: number;
  systemMessageType: SystemMessageType;
  text: string;
  userCreator: IUserPreview;
  linkedMessageId: number;
  linkedMessageType: MessageLinkType;
}
