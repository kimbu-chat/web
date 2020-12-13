import { AudioAttachment, IGroupable } from '../../models';

export interface GetAudioAttachmentsSuccessActionPayload {
  chatId: number;
  audios: (AudioAttachment & IGroupable)[];
  hasMore: boolean;
}
