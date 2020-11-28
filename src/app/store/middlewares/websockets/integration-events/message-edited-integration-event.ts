export interface MessageEditedIntegrationEvent {
  attachments: string; // TODO: Check for a generic JSON that will receive BaseAttachment[]
  chatId: number;
  messageId: number;
  text: string;
  userEditorId: number;
}
