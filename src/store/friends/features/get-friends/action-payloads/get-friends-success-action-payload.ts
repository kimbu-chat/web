import { IUser } from '../../../../common/models';

export interface IGetFriendsSuccessActionPayload {
  users: Array<IUser>;
  name?: string;
  initializedBySearch?: boolean;
  hasMore: boolean;
}
