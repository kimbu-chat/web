import { IUser } from '../../../../common/models';

export interface IGetFriendsSuccessActionPayload {
  users: Array<IUser>;
  name?: string;
  initializedByScroll?: boolean;
  hasMore: boolean;
}
