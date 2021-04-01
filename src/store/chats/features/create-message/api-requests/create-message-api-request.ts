import { IAttachmentCreation } from '../../../models';

export interface ICreateMessageApiRequest {
  text?: string;
  chatId?: number;
  clientId?: number;
  attachments?: IAttachmentCreation[];
  link?: {
    type: 'Reply' | 'Forward';
    originalMessageId: number;
  };
}
