import { IChat } from './chat';

export interface IChatsState {
  loading?: boolean;
  hasMore: boolean;
  searchString: string;
  chats: IChat[];
  selectedChatId: number | null;
  selectedMessageIds: number[];
}
