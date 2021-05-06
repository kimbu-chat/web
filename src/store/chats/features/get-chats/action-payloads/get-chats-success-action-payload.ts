import { ById } from '@store/chats/models/by-id';
import { INormalizedChat } from '../../../models/chat';

export interface IGetChatsSuccessActionPayload {
  initializedByScroll: boolean;
  chats: ById<INormalizedChat>;
  chatIds: number[];
  hasMore: boolean;
  searchString?: string;
}
