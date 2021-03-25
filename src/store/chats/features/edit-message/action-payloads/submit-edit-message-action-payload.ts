import { IAttachmentCreation, IBaseAttachment } from '../../../models';

export interface ISumbitEditMessageActionPayload {
  text: string;
  removedAttachments?: IAttachmentCreation[];
  newAttachments?: IBaseAttachment[];
  messageId: number;
}
