import { IUser } from '../../../../common/models';

export interface IGetGroupChatUsersSuccessActionPayload {
  chatId: number;
  isFromSearch?: boolean;
  hasMore: boolean;
  users: IUser[];
}
