import { IUser } from 'app/store/common/models';

export interface IFriendsState {
  loading: boolean;
  friends: IUser[];
  hasMoreFriends: boolean;
}
