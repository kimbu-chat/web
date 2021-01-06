import { IUserPreview } from 'app/store/models';

export interface IGetGroupChatUsersSuccessActionPayload {
  chatId: number;
  isFromSearch?: boolean;
  hasMore: boolean;
  users: IUserPreview[];
}
