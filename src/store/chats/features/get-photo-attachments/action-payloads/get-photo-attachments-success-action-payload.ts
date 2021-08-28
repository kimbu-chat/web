import { IPictureAttachment } from 'kimbu-models';

import { IGroupable } from '@store/chats/models';

export interface IGetPhotoAttachmentsSuccessActionPayload {
  chatId: string;
  photos: (IPictureAttachment & IGroupable)[];
  hasMore: boolean;
}
