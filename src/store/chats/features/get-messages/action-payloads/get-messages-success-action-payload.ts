import { INormalizedMessage } from '../../../models';

export interface IGetMessagesSuccessActionPayload {
  messageList: {
    messages: Record<number, INormalizedMessage>;
    messageIds: number[];
    hasMoreMessages: boolean;
    chatId: number;
    isFromScroll?: boolean;
    searchString?: string;
  };
}
