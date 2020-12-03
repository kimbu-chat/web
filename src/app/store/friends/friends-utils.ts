import { FriendsState } from './models';

export const checkUserExist = (userId: number, state: FriendsState): boolean => Boolean(state.friends.find(({ id }) => id === userId));

export const findUserIndex = (userId: number, state: FriendsState): number => state.friends.findIndex(({ id }) => id === userId);
