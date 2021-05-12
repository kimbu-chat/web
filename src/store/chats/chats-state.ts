import { ById } from './models/by-id';
import { INormalizedChat } from './models/chat';

interface IChatList {
  loading?: boolean;
  hasMore: boolean;
  chatIds: number[];
  page: number;
}

export interface IChatsState {
  chats: ById<INormalizedChat>;

  chatList: IChatList;
  searchChatList: IChatList;

  selectedChatId: number | null;
  selectedMessageIds: number[];

  chatInfo: {
    chatId?: number;
    isInfoOpened: boolean;
  };
}
