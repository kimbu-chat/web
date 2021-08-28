import { INormalizedMessage } from '../../../models';

export interface IGetMessagesSuccessActionPayload {
  messageList: {
    messages: Record<string, INormalizedMessage>;
    messageIds: string[];
    hasMoreMessages: boolean;
    chatId: string;
    isFromScroll?: boolean;
    searchString?: string;
  };
}
