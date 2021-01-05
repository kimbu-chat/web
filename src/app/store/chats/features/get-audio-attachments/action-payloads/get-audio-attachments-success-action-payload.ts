import { IAudioAttachment, IGroupable } from '../../../models';

export interface IGetAudioAttachmentsSuccessActionPayload {
  chatId: number;
  audios: (IAudioAttachment & IGroupable)[];
  hasMore: boolean;
}
