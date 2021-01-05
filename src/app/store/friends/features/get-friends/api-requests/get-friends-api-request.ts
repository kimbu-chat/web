import { IPage } from 'app/store/models';

export interface IGetFriendsApiRequest {
  page: IPage;
  name?: string;
}
