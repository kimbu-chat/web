import { IUser } from 'app/store/common/models';

export interface IGetFriendsSuccessActionPayload {
  users: Array<IUser>;
  name?: string;
  initializedBySearch?: boolean;
  hasMore: boolean;
}
