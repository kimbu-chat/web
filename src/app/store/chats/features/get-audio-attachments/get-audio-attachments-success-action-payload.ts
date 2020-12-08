import { AudioList } from '../../models';

export interface GetAudioAttachmentsSuccessActionPayload extends AudioList {
  chatId: number;
}
