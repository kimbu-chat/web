interface IFriendList {
  friendIds: string[];
  loading: boolean;
  hasMore: boolean;
}

export interface IFriendsState {
  friends: IFriendList;
  searchFriends: IFriendList;
}
