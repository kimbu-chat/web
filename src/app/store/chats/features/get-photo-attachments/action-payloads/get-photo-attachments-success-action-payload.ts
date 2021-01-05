import { IPictureAttachment, IGroupable } from '../../../models';

export interface IGetPhotoAttachmentsSuccessActionPayload {
  chatId: number;
  photos: (IPictureAttachment & IGroupable)[];
  hasMore: boolean;
}
