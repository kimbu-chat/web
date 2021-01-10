import { IAttachmentCreation } from 'app/store/chats/models';

export interface ICreateMessageApiRequest {
  text?: string;
  chatId?: number;
  attachments?: IAttachmentCreation[];
  link?: {
    type: 'Reply' | 'Forward';
    originalMessageId: number;
  };
}
