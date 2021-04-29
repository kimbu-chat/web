import { ById } from '@store/chats/models/by-id';
import { IUser } from '@store/common/models';
import { IChat } from '../../../models/chat';

export interface IGetChatsSuccessActionPayload {
  initializedByScroll: boolean;
  chats: ById<IChat>;
  users: ById<IUser>;
  chatIds: number[];
  hasMore: boolean;
  searchString?: string;
}
