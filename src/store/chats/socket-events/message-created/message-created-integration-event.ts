import { IUser, IAttachmentBase, SystemMessageType, MessageLinkType } from 'kimbu-models';

export interface IMessageCreatedIntegrationEvent {
  attachments?: IAttachmentBase[];
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
