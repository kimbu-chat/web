import { IMessage } from './models/message';
import { ById } from './models/by-id';
import { IChat } from './models/chat';

interface IChatList {
  loading?: boolean;
  hasMore: boolean;
  chats: IChat[];
  page: number;
}

export interface IChatsState {
  messages: ById<{
    messages: IMessage[];
    loading: boolean;
    hasMore: boolean;
    searchString?: string;
  }>;

  chats: IChatList;
  searchChats: IChatList;

  selectedChatId: number | null;
  selectedMessageIds: number[];

  isInfoOpened: boolean;
}
