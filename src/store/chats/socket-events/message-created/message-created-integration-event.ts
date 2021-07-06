import { IUser } from '../../../common/models';
import { IBaseAttachment, SystemMessageType } from '../../models';
import { MessageLinkType } from '../../models/linked-message-type';

export interface IMessageCreatedIntegrationEvent {
  attachments?: IBaseAttachment[];
  chatId: number;
  creationDateTime: string;
  id: number;
  clientId: number;
  systemMessageType: SystemMessageType;
  text: string;
  userCreator: IUser;
  linkedMessageId: number;
  linkedMessageType: MessageLinkType;
}
