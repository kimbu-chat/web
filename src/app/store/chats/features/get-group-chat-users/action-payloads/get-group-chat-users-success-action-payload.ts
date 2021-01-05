import { IUserPreview } from 'app/store/my-profile/models';

export interface IGetGroupChatUsersSuccessActionPayload {
  chatId: number;
  isFromSearch?: boolean;
  isFromScroll?: boolean;
  hasMore: boolean;
  users: IUserPreview[];
}
