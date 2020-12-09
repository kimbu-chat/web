import { VideoList } from '../../models';

export interface GetVideoAttachmentsSuccessActionPayload extends VideoList {
  chatId: number;
}
