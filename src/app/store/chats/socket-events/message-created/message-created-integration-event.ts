import { IBaseAttachment, SystemMessageType } from 'store/chats/models';
import { IUser } from 'app/store/common/models';
import { MessageLinkType } from '../../models/linked-message-type';

export interface IMessageCreatedIntegrationEvent {
  attachments?: IBaseAttachment[];
  chatId: number;
  creationDateTime: Date;
  id: number;
  systemMessageType: SystemMessageType;
  text: string;
  userCreator: IUser;
  linkedMessageId: number;
  linkedMessageType: MessageLinkType;
}
