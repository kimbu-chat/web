import { IAttachmentBase, SystemMessageType, MessageLinkType } from 'kimbu-models';

import { MessageState } from './message-state';
import { INormalizedLinkedMessage } from './normalized-linked-message';

export interface INormalizedMessage {
  id: string;
  clientId?: string;
  userCreatorId: string;
  creationDateTime: string;
  text?: string;
  attachmentsJson?: string;
  systemMessageType: SystemMessageType;
  state?: MessageState;
  chatId: string;

  isEdited?: boolean;
  isDeleted?: boolean;

  attachments?: (IAttachmentBase & { clientId?: number })[];
  linkedMessageType?: MessageLinkType;
  linkedMessage?: INormalizedLinkedMessage | null;
}
