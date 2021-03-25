import { IPage } from '../../../../common/models';

export interface IGetGroupChatUsersApiRequest {
  groupChatId: number;
  name?: string;
  page: IPage;
}
