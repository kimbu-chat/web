import { IAttachmentBase, SystemMessageType, MessageLinkType } from 'kimbu-models';

import { IAttachmentToSend } from '@store/chats/models/attachment-to-send';

import { MessageState } from './message-state';

import type { INormalizedLinkedMessage } from './normalized-linked-message';

export interface IAttachmentWithClient extends IAttachmentBase {
  clientId?: number;
}

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

  attachments?: IAttachmentWithClient[];
  linkedMessageType?: MessageLinkType;
  linkedMessage?: INormalizedLinkedMessage;
  attachmentsToSend?: Record<number, IAttachmentToSend<IAttachmentBase>>;
}
