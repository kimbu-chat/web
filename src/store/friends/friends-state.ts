import { IUser } from '../common/models';

interface IFriendList {
  loading: boolean;
  hasMore: boolean;
}

export interface IFriendsState {
  friends: IFriendList & { friends: IUser[] };
  searchFriends: IFriendList & { friends?: IUser[] };
}
