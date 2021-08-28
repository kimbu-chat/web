import { IAudioAttachment } from 'kimbu-models';

import { IGroupable } from '../../../models';

export interface IGetAudioAttachmentsSuccessActionPayload {
  chatId: string;
  audios: (IAudioAttachment & IGroupable)[];
  hasMore: boolean;
}
