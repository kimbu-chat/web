import { IPage } from 'app/store/models';

export interface IGetGroupChatUsersApiRequest {
  groupChatId: number;
  name?: string;
  page: IPage;
}
