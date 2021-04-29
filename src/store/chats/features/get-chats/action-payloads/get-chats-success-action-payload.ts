import { ById } from '@store/chats/models/by-id';
import { IChat } from '../../../models/chat';

export interface IGetChatsSuccessActionPayload {
  initializedByScroll: boolean;
  chats: ById<IChat>;
  chatIds: number[];
  hasMore: boolean;
  searchString?: string;
}
