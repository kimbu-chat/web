import { INormalizedChat } from './models';

interface IChatList {
  loading?: boolean;
  hasMore: boolean;
  chatIds: number[];
  page: number;
}

export interface IChatsState {
  chats: Record<number, INormalizedChat>;

  chatList: IChatList;
  searchChatList: IChatList;

  selectedChatId?: number;
  selectedMessageIds: number[];

  chatInfo: {
    chatId?: number;
    isInfoOpened: boolean;
  };
}
