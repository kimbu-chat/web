import { IAttachmentBase } from 'kimbu-models';

import { IGroupable } from '@store/chats/models';

export interface IGetRawAttachmentsSuccessActionPayload {
  chatId: number;
  files: (IAttachmentBase & IGroupable)[];
  hasMore: boolean;
}
