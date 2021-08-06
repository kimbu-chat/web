import { INormalizedChat } from './models';
import { ById } from './models/by-id';

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

  selectedChatId?: number;
  selectedMessageIds: number[];

  chatInfo: {
    chatId?: number;
    isInfoOpened: boolean;
  };
}
