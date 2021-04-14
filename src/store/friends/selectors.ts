import { RootState } from 'typesafe-actions';
import { IFriendsState } from './friends-state';

// state-selectors

export const getMyFriendsListSelector = (state: RootState) => state.friends.friends;

export const getMySearchFriendsListSelector = (state: RootState) => state.friends.searchFriends;

export const getFriendByIdSelector = (id: number) => (state: RootState) =>
  state.friends.friends.friends.find((friend) => friend.id === id);

export const isFriend = (userId?: number) => (state: RootState) =>
  state.friends.friends.friends.findIndex(({ id }) => id === userId) > -1;

// draft-selectors

export const getUserDraftSelector = (userId: number, state: IFriendsState) =>
  state.friends.friends.find(({ id }) => id === userId);
