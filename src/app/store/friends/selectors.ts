import { RootState } from '../root-reducer';

export const getMyFriends = (state: RootState) => state.friends.friends;

export const getHasMoreFriends = (state: RootState) => state.friends.hasMoreFriends;

export const getMembersForSelectedGroupChat = (state: RootState) => state.friends.usersForSelectedGroupChat;
