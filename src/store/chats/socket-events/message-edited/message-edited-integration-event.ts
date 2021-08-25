export interface IMessageEditedIntegrationEvent {
  attachments: string; // TODO: Check for a generic JSON that will receive BaseAttachment[]
  chatId: number;
  messageId: string;
  text: string;
  userEditorId: number;
}
