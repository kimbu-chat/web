import { IFriendsState } from './models';
import { RootState } from '../root-reducer';

// state-selectors

export const getMyFriendsSelector = (state: RootState) => state.friends.friends;

export const getFriendByIdSelector = (id: number) => (state: RootState) => state.friends.friends.find((friend) => friend.id === id);

export const getFriendsLoadingSelector = (state: RootState) => state.friends.loading;

export const getHasMoreFriendsSelector = (state: RootState) => state.friends.hasMoreFriends;

// draft-selectors

export const getUserIndexDraftSelector = (userId: number, state: IFriendsState): number => state.friends.findIndex(({ id }) => id === userId);
