import { INormalizedChat } from './models';

interface IChatList {
  loading?: boolean;
  hasMore: boolean;
  chatIds: string[];
  page: number;
}

export interface IChatsState {
  chats: Record<string, INormalizedChat>;

  chatList: IChatList;
  searchChatList: IChatList;

  selectedChatId?: string;
  selectedMessageIds: string[];

  chatInfo: {
    chatId?: string;
    isInfoOpened: boolean;
  };
}
