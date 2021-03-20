import { IMessage } from '@store/chats/models';

export interface IMessagesDeletedIntegrationEventHandlerSuccessActionPayload {
  chatId: number;
  messageIds: number[];
  chatNewLastMessage: IMessage | null;
}
