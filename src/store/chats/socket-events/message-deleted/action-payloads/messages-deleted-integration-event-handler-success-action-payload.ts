import { INormalizedMessage } from '@store/chats/models';

export interface IMessagesDeletedIntegrationEventHandlerSuccessActionPayload {
  chatId: number;
  messageIds: number[];
  chatNewLastMessage: INormalizedMessage | null;
}
