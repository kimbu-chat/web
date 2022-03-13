import { IAttachmentBase } from 'kimbu-models';

import { IAttachmentCreation, IAttachmentToSend } from '@store/chats/models';

export interface ISubmitEditMessageActionPayload {
  text: string;
  removedAttachments?: IAttachmentCreation[];
  newAttachments?: (IAttachmentToSend | IAttachmentBase)[];
  messageId: number;
}
