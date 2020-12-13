import { IGroupable, VoiceAttachment } from '../../models';

export interface GetVoiceAttachmentsSuccessActionPayload {
  chatId: number;
  recordings: (VoiceAttachment & IGroupable)[];
  hasMore: boolean;
}
