import { RootState } from 'typesafe-actions';

// state-selectors

export const getMyFriendsListSelector = (state: RootState) => state.friends.friends;

export const getMySearchFriendsListSelector = (state: RootState) => state.friends.searchFriends;

export const getLoadedFriendsCountSelector = (state: RootState) =>
  state.friends.friends.friendIds.length;
export const getLoadedSearchFriendsCountSelector = (state: RootState) =>
  state.friends.searchFriends.friendIds.length;

export const getFriendByIdSelector = (id: number) => (state: RootState) => state.users.users[id];

export const isFriend = (userId?: number) => (state: RootState) =>
  state.friends.friends.friendIds.includes(userId || -1);
