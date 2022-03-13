import { IAttachmentBase, SystemMessageType, MessageLinkType } from 'kimbu-models';

import { IAttachmentToSend } from '@store/chats/models/attachment-to-send';

import { MessageState } from './message-state';

export interface INormalizedMessage {
  id: number;
  clientId?: number;
  userCreatorId: number;
  creationDateTime: string;
  text?: string;
  attachmentsJson?: string;
  systemMessageType: SystemMessageType;
  state?: MessageState;
  chatId: number;

  isEdited?: boolean;
  isDeleted?: boolean;

  attachments: (IAttachmentBase | IAttachmentToSend)[];
  linkedMessageType?: MessageLinkType;
  linkedMessage?: INormalizedMessage;
}
