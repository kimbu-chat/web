import { IChat } from '../../../models/chat';

export interface IGetChatsSuccessActionPayload {
  initializedByScroll: boolean;
  chats: IChat[];
  hasMore: boolean;
}
