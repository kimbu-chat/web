import { IAttachmentCreation, IBaseAttachment } from '../../../models';

export interface ISumbitEditMessageSuccessActionPayload {
  messageId: number;
  chatId: number;
  text: string;
  removedAttachments?: IAttachmentCreation[];
  newAttachments?: IBaseAttachment[];
}
