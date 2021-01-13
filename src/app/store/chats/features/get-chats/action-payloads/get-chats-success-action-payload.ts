import { IChat } from 'app/store/chats/models/chat';

export interface IGetChatsSuccessActionPayload {
  initializedByScroll: boolean;
  chats: IChat[];
  hasMore: boolean;
}
