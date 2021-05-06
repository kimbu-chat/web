import { ById } from '@store/chats/models/by-id';
import { INormalizedMessage } from '../../../models';

export interface IGetMessagesSuccessActionPayload {
  messageList: {
    messages: ById<INormalizedMessage>;
    messageIds: number[];
    hasMoreMessages: boolean;
    chatId: number;
    isFromScroll?: boolean;
    searchString?: string;
  };
}
