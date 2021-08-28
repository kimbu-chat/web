export interface IMessageEditedIntegrationEvent {
  attachments: string; // TODO: Check for a generic JSON that will receive BaseAttachment[]
  chatId: string;
  messageId: string;
  text: string;
  userEditorId: string;
}
