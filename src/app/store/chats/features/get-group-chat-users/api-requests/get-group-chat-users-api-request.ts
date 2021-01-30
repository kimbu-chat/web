import { IPage } from 'app/store/common/models';

export interface IGetGroupChatUsersApiRequest {
  groupChatId: number;
  name?: string;
  page: IPage;
}
