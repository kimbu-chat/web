import { IMessage } from 'app/store/chats/models';

export interface IGetMessagesSuccessActionPayload {
  messages: IMessage[];
  hasMoreMessages: boolean;
  chatId: number;
}
