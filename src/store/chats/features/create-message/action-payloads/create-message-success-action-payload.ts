import { IAttachmentBase } from 'kimbu-models';

import { MessageState } from '@store/chats/models';

export interface ICreateMessageSuccessActionPayload {
  oldMessageId: number;
  newMessageId: number;
  messageState: MessageState;
  attachments?: IAttachmentBase[];
  chatId: number;
}
