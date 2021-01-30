import { IPage } from 'app/store/common/models';

export interface IGetFriendsActionPayload {
  page: IPage;
  name?: string;
  initializedBySearch?: boolean;
}
