import { IFriendsState } from './models';

export const checkUserExist = (userId: number, state: IFriendsState): boolean => Boolean(state.friends.find(({ id }) => id === userId));

export const findUserIndex = (userId: number, state: IFriendsState): number => state.friends.findIndex(({ id }) => id === userId);
