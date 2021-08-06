import { IVideoAttachment } from 'kimbu-models';

import { IGroupable } from '@store/chats/models';

export interface IGetVideoAttachmentsSuccessActionPayload {
  chatId: number;
  videos: (IVideoAttachment & IGroupable)[];
  hasMore: boolean;
}
