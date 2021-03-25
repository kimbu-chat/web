import { IUser } from '../common/models';

export interface IFriendsState {
  loading: boolean;
  friends: IUser[];
  hasMoreFriends: boolean;
}
