import { IUser } from '@store/common/models';

import { IBaseAttachment } from './attachments/base-attachment';
import { MessageLinkType } from './linked-message-type';
import { ILinkedMessage, INormalizedLinkedMessage } from './linked-message';
import { MessageState } from './message-state';
import { SystemMessageType } from './system-message-type';

export interface IMessage {
  id: number;
  userCreator: IUser;
  creationDateTime: Date;
  text: string;
  attachmentsJson?: string;
  systemMessageType: SystemMessageType;
  state?: MessageState;
  chatId: number;
  isSelected?: boolean;

  isEdited?: boolean;
  isDeleted?: boolean;

  attachments?: IBaseAttachment[];
  linkedMessageType?: MessageLinkType;
  linkedMessage?: ILinkedMessage | null;
}

export interface INormalizedMessage {
  id: number;
  userCreatorId: number;
  creationDateTime: Date;
  text: string;
  attachmentsJson?: string;
  systemMessageType: SystemMessageType;
  state?: MessageState;
  chatId: number;

  isEdited?: boolean;
  isDeleted?: boolean;

  attachments?: IBaseAttachment[];
  linkedMessageType?: MessageLinkType;
  linkedMessage?: INormalizedLinkedMessage | null;
}
