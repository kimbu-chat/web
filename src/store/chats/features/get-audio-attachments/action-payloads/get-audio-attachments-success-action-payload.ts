import { IAudioAttachment } from 'kimbu-models';

import { IGroupable } from '../../../models';

export interface IGetAudioAttachmentsSuccessActionPayload {
  chatId: number;
  audios: (IAudioAttachment & IGroupable)[];
  hasMore: boolean;
}
