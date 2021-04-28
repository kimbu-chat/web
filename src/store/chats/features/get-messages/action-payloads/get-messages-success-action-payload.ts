import { IUser } from '@store/common/models';
import { INormalizedMessage } from '../../../models';

export interface IGetMessagesSuccessActionPayload {
  messageList: {
    messages: INormalizedMessage[];
    messageIds: number[];
    hasMoreMessages: boolean;
    chatId: number;
    isFromSearch?: boolean;
    searchString?: string;
  };

  users: IUser[];
}
