import { IAttachmentBase } from 'kimbu-models';

import { MessageState } from '@store/chats/models';

export interface ICreateMessageSuccessActionPayload {
  draftMessageId: number;
  newMessageId: number;
  messageState: MessageState;
  attachments?: IAttachmentBase[];
  chatId: number;
}
