import { IUser, IAttachmentBase, SystemMessageType, MessageLinkType } from 'kimbu-models';

export interface IMessageCreatedIntegrationEvent {
  attachments?: IAttachmentBase[];
  chatId: number;
  creationDateTime: string;
  id: string;
  clientId: string;
  systemMessageType: SystemMessageType;
  text: string;
  userCreator: IUser;
  linkedMessageId: string;
  linkedMessageType: MessageLinkType;
}
