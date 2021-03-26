import { IVideoAttachment, IGroupable } from '../../../models';

export interface IGetVideoAttachmentsSuccessActionPayload {
  chatId: number;
  videos: (IVideoAttachment & IGroupable)[];
  hasMore: boolean;
}
