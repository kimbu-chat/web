import { IGroupable, IVoiceAttachment } from '../../../models';

export interface IGetVoiceAttachmentsSuccessActionPayload {
  chatId: number;
  recordings: (IVoiceAttachment & IGroupable)[];
  hasMore: boolean;
}
