interface IFriendList {
  friendIds: number[];
  loading: boolean;
  hasMore: boolean;
}

export interface IFriendsState {
  friends: IFriendList;
  searchFriends: IFriendList;
}
