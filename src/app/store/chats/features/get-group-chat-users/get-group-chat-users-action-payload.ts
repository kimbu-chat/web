import { IPage } from 'app/store/common/models';

export interface IGetGroupChatUsersActionPayload {
  groupChatId: number;
  page: IPage;
  isFromSearch?: boolean;
  isFromScroll?: boolean;
  name?: string;
}
