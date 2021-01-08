import { IAttachmentCreation } from 'app/store/chats/models';

export interface ICreateMessageApiRequest {
  text?: string;
  chatId?: number;
  attachments?: IAttachmentCreation[];
  replyToMessageId?: number;
}
