import { IUser } from 'app/store/common/models';

export interface IGetGroupChatUsersSuccessActionPayload {
  chatId: number;
  isFromSearch?: boolean;
  hasMore: boolean;
  users: IUser[];
}
