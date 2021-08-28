import { INormalizedChat } from '../../../models/chat';

export interface IGetChatsSuccessActionPayload {
  initializedByScroll: boolean;
  chats: Record<string, INormalizedChat>;
  chatIds: string[];
  hasMore: boolean;
  searchString?: string;
}
