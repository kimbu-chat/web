import { RawAttachment, IGroupable } from '../../models';

export interface GetRawAttachmentsSuccessActionPayload {
  chatId: number;
  files: (RawAttachment & IGroupable)[];
  hasMore: boolean;
}
