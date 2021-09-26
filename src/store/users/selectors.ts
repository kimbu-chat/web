import { RootState } from 'typesafe-actions';

export const getUserListSelector = (state: RootState) => state.users.users;

export const getUserSelector = (userId?: number) => (state: RootState) =>
  userId ? state.users.users[userId] : undefined;

export const getUsersSelector = (state: RootState) => state.users.users;
