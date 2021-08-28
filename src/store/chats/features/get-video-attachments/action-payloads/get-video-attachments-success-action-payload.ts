import { IVideoAttachment } from 'kimbu-models';

import { IGroupable } from '@store/chats/models';

export interface IGetVideoAttachmentsSuccessActionPayload {
  chatId: string;
  videos: (IVideoAttachment & IGroupable)[];
  hasMore: boolean;
}
