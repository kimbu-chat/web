import { BaseAttachment } from 'app/store/chats/models';
import { AttachmentCreation } from '../../models';

export interface SumbitEditMessageActionPayload {
  messageId: number;
  chatId: number;
  text: string;
  removedAttachments?: AttachmentCreation[];
  newAttachments?: BaseAttachment[];
}
