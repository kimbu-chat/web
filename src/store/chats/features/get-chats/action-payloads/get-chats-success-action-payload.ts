import { INormalizedChat } from '../../../models/chat';

export interface IGetChatsSuccessActionPayload {
  initializedByScroll: boolean;
  chats: Record<number, INormalizedChat>;
  chatIds: number[];
  hasMore: boolean;
  searchString?: string;
}
