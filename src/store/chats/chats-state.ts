import { INormalizedMessage } from './models/message';
import { ById } from './models/by-id';
import { INormalizedChat } from './models/chat';

interface IChatList {
  loading?: boolean;
  hasMore: boolean;
  chatIds: number[];
  page: number;
}

export interface IChatsState {
  messages: ById<{
    messages: ById<INormalizedMessage>;
    messageIds: number[];
    loading: boolean;
    hasMore: boolean;
    searchString?: string;
  }>;

  chats: ById<INormalizedChat>;

  chatList: IChatList;
  searchChatList: IChatList;

  selectedChatId: number | null;
  selectedMessageIds: number[];

  isInfoOpened: boolean;
}
