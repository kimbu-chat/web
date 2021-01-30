import { IPage } from 'app/store/common/models';

export interface IGetFriendsApiRequest {
  page: IPage;
  name?: string;
}
