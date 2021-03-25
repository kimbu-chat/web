import { IMessage } from './models/message';
import { ById } from './models/by-id';
import { IChat } from './models/chat';

export interface IChatsState {
  loading?: boolean;
  hasMore: boolean;
  searchString: string;
  chats: IChat[];

  messages: ById<{
    messages: IMessage[];
    loading: boolean;
    hasMore: boolean;
    searchString?: string;
  }>;

  searchChats: IChat[];
  selectedChatId: number | null;
  selectedMessageIds: number[];

  isInfoOpened: boolean;

  page: number;
  searchPage: number;
}
