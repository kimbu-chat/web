import { PictureAttachment, IGroupable } from '../../models';

export interface GetPhotoAttachmentsSuccessActionPayload {
  chatId: number;
  photos: (PictureAttachment & IGroupable)[];
  hasMore: boolean;
}
