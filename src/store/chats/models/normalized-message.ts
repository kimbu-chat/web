import { IAttachmentBase, SystemMessageType, MessageLinkType } from 'kimbu-models';

import { MessageState } from './message-state';
import { INormalizedLinkedMessage } from './normalized-linked-message';

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

  attachments?: (IAttachmentBase & { clientId?: number })[];
  linkedMessageType?: MessageLinkType;
  linkedMessage?: INormalizedLinkedMessage | null;
}
