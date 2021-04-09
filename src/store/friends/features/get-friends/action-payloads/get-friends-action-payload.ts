import { IPage } from '../../../../common/models';

export interface IGetFriendsActionPayload {
  page: IPage;
  name?: string;
  initializedByScroll?: boolean;
}
