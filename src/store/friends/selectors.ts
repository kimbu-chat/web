import { RootState } from 'typesafe-actions';
import { IFriendsState } from './friends-state';

// state-selectors

export const getMyFriendsSelector = (state: RootState) => state.friends.friends;

export const getMySearchFriendsSelector = (state: RootState) => state.friends.searchFriends;

export const getFriendByIdSelector = (id: number) => (state: RootState) =>
  state.friends.friends.find((friend) => friend.id === id);

export const getFriendsLoadingSelector = (state: RootState) => state.friends.loading;

export const getHasMoreFriendsSelector = (state: RootState) => state.friends.hasMoreFriends;

export const isFriend = (userId?: number) => (state: RootState) =>
  state.friends.friends.findIndex(({ id }) => id === userId) > -1;

// draft-selectors

export const getUserDraftSelector = (userId: number, state: IFriendsState) =>
  state.friends.find(({ id }) => id === userId);
