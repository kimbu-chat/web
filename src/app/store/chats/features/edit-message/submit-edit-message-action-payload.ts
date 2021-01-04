import { IBaseAttachment } from 'app/store/chats/models';
import { IAttachmentCreation } from '../../models';

export interface ISumbitEditMessageActionPayload {
  text: string;
  removedAttachments?: IAttachmentCreation[];
  newAttachments?: IBaseAttachment[];
}
