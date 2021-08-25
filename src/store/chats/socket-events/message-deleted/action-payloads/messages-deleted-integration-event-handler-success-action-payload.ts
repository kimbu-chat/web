import { INormalizedMessage } from '@store/chats/models';

export interface IMessagesDeletedIntegrationEventHandlerSuccessActionPayload {
  chatId: number;
  messageIds: string[];
  chatNewLastMessage: INormalizedMessage | null;
}
