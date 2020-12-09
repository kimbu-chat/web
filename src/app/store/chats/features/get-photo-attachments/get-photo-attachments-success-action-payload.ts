import { PhotoList } from '../../models';

export interface GetPhotoAttachmentsSuccessActionPayload extends PhotoList {
  chatId: number;
}
