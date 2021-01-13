import { IChat } from './chat';

export interface IChatsState {
  loading?: boolean;
  hasMore: boolean;
  searchString: string;
  chats: IChat[];
  searchChats: IChat[];
  selectedChatId: number | null;
  selectedMessageIds: number[];

  page: number;
  searchPage: number;
}
