import { IAttachmentCreation } from '../../../models';

export interface ISubmitEditMessageApiRequest {
  text: string;
  messageId: number;
  removedAttachments?: IAttachmentCreation[];
  newAttachments?: IAttachmentCreation[];
}
