import { UserPreview } from 'app/store/my-profile/models';

export interface GetGroupChatUsersSuccessActionPayload {
  chatId: number;
  isFromSearch?: boolean;
  isFromScroll?: boolean;
  users: Array<UserPreview>;
}
