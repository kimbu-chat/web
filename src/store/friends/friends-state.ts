import { IUser } from '../common/models';

interface IFriendList {
  loading: boolean;
  friends: IUser[];
  hasMore: boolean;
}

export interface IFriendsState {
  friends: IFriendList;
  searchFriends: IFriendList;
}
