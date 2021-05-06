import { RootState } from 'typesafe-actions';
import { IUser } from '../common/models';

export const myIdSelector = (state: RootState): number | undefined => state.myProfile.userId;

export const myProfileSelector = (state: RootState): IUser | undefined =>
  state.users.users[state.myProfile.userId || -1];

export const myPhoneNumberSelector = (state: RootState): string | undefined =>
  state.users.users[state.myProfile.userId || -1]?.phoneNumber;

export const myFullNameSelector = (state: RootState): string | undefined => {
  const myProfile = state.users.users[state.myProfile.userId || -1];

  return `${myProfile?.firstName} ${myProfile?.lastName}`;
};

export const myProfilePhotoSelector = (state: RootState): string | undefined =>
  state.users.users[state.myProfile.userId || -1]?.avatar?.previewUrl;

export const tabActiveSelector = (state: RootState) => state.myProfile.isTabActive;
