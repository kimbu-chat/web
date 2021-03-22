import { IPage } from '../../../../common/models';

export interface IGetFriendsApiRequest {
  page: IPage;
  name?: string;
}
