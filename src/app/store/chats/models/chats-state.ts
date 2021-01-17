import { IMessage } from './message';
import { ById } from './by-id';
import { IChat } from './chat';

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
