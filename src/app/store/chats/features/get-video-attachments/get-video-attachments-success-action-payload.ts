import { VideoAttachment, IGroupable } from '../../models';

export interface GetVideoAttachmentsSuccessActionPayload {
  chatId: number;
  videos: (VideoAttachment & IGroupable)[];
  hasMore: boolean;
}
