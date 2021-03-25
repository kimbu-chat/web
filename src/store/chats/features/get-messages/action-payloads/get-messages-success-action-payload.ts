import { IMessage } from '../../../models';

export interface IGetMessagesSuccessActionPayload {
  messages: IMessage[];
  hasMoreMessages: boolean;
  chatId: number;
  isFromSearch?: boolean;
  searchString?: string;
}
