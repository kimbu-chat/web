import { IBaseAttachment, IGroupable } from '../../../models';

export interface IGetRawAttachmentsSuccessActionPayload {
  chatId: number;
  files: (IBaseAttachment & IGroupable)[];
  hasMore: boolean;
}
