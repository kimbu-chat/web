import { RootState } from 'typesafe-actions';

// state-selectors

export const getMyFriendsListSelector = (state: RootState) => state.friends.friends;

export const getMySearchFriendsListSelector = (state: RootState) => state.friends.searchFriends;

export const getLoadedFriendsCountSelector = (state: RootState) =>
  state.friends.friends.friendIds.length;
export const getLoadedSearchFriendsCountSelector = (state: RootState) =>
  state.friends.searchFriends.friendIds.length;

export const getFriendByIdSelector = (id: string) => (state: RootState) => state.users.users[id];

export const isFriend = (userId: string | undefined) => (state: RootState) =>
  userId && state.friends.friends.friendIds.includes(userId);
