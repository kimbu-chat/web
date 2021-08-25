import { IAttachmentBase } from 'kimbu-models';

import { MessageState } from '@store/chats/models';

export interface ICreateMessageSuccessActionPayload {
  oldMessageId: string;
  newMessageId: string;
  messageState: MessageState;
  attachments?: IAttachmentBase[];
  chatId: number;
}
