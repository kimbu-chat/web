import { IRawAttachment, IGroupable } from '../../../models';

export interface IGetRawAttachmentsSuccessActionPayload {
  chatId: number;
  files: (IRawAttachment & IGroupable)[];
  hasMore: boolean;
}
