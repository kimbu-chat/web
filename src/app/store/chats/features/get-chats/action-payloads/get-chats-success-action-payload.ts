import { IChat } from 'app/store/chats/models/chat';

export interface IGetChatsSuccessActionPayload {
  initializedBySearch: boolean;
  chats: IChat[];
  hasMore: boolean;
}
