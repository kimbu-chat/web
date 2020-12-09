import { BaseAttachment } from 'app/store/chats/models';

export interface MessageEditedActionPayload {
  attachments: BaseAttachment[];
  chatId: number;
  messageId: number;
  text: string;
  userEditorId: number;
}
