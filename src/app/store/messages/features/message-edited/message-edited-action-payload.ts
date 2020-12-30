import { IBaseAttachment } from 'app/store/chats/models';

export interface IMessageEditedActionPayload {
  attachments: IBaseAttachment[];
  chatId: number;
  messageId: number;
  text: string;
  userEditorId: number;
}
