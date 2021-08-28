import { IVoiceAttachment } from 'kimbu-models';

import { IGroupable } from '@store/chats/models';

export interface IGetVoiceAttachmentsSuccessActionPayload {
  chatId: string;
  recordings: (IVoiceAttachment & IGroupable)[];
  hasMore: boolean;
}
