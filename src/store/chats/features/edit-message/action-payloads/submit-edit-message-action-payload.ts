import { IAttachmentBase } from 'kimbu-models';

import { IAttachmentCreation } from '@store/chats/models';

export interface ISumbitEditMessageActionPayload {
  text: string;
  removedAttachments?: IAttachmentCreation[];
  newAttachments?: IAttachmentBase[];
  messageId: string;
}
