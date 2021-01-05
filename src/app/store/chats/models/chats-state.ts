import { IChat } from './chat';
import { IMessage } from './message';

export interface IChatsState {
  loading: boolean;
  hasMore: boolean;
  searchString: string;
  chats: IChat[];
  selectedChatId: number | null;

  selectedMessageIds: number[];
  messageToEdit?: IMessage;
  messageToReply?: IMessage;
}
