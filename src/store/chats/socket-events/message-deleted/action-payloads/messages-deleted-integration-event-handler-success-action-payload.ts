import { INormalizedMessage } from '@store/chats/models';
import { IUser } from '@store/common/models';

export interface IMessagesDeletedIntegrationEventHandlerSuccessActionPayload {
  chatId: number;
  messageIds: number[];
  users: IUser[];
  chatNewLastMessage: INormalizedMessage | null;
}
