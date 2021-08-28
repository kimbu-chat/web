import { INormalizedMessage } from '@store/chats/models';

export interface IMessagesDeletedIntegrationEventHandlerSuccessActionPayload {
  chatId: string;
  messageIds: string[];
  chatNewLastMessage: INormalizedMessage | null;
}
