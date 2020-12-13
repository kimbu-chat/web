import { RootState } from '../root-reducer';

export const getMyFriends = (state: RootState) => state.friends.friends;

export const getFriendsLoading = (state: RootState) => state.friends.loading;

export const getHasMoreFriends = (state: RootState) => state.friends.hasMoreFriends;
