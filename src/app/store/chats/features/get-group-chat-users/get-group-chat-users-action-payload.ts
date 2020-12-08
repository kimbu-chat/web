import { Page } from 'app/store/common/models';

export interface GetGroupChatUsersActionPayload {
  groupChatId: number;
  page: Page;
  isFromSearch?: boolean;
  isFromScroll?: boolean;
  name?: string;
}
