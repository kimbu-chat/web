import { IUser } from '@store/common/models';
import { IChat } from '../../../models/chat';

export interface IGetChatsSuccessActionPayload {
  initializedByScroll: boolean;
  chats: IChat[];
  users: IUser[];
  hasMore: boolean;
  searchString?: string;
}
