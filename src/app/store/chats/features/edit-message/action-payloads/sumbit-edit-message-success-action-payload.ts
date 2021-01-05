import { IBaseAttachment } from 'app/store/chats/models';
import { IAttachmentCreation } from '../../../models';

export interface ISumbitEditMessageSuccessActionPayload {
  messageId: number;
  chatId: number;
  text: string;
  removedAttachments?: IAttachmentCreation[];
  newAttachments?: IBaseAttachment[];
}
