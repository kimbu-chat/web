import { IPage } from 'app/store/models';

export interface IGetFriendsActionPayload {
  page: IPage;
  name?: string;
  initializedBySearch?: boolean;
}
