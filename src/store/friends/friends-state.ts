import { IUser } from '../common/models';

export interface IFriendsState {
  loading: boolean;
  friends: IUser[];
  searchFriends: IUser[];
  hasMoreFriends: boolean;
}
