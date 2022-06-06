import { IUser } from 'kimbu-models';

import { RootState } from '..';

const undefinedKey = -1;

export const myIdSelector = (state: RootState): number => state.myProfile.userId;

export const myProfileSelector = (state: RootState): IUser | undefined =>
  state.users.users[state.myProfile.userId || undefinedKey];

export const myPhoneNumberSelector = (state: RootState): string | undefined =>
  state.users.users[state.myProfile.userId || undefinedKey]?.phoneNumber;

export const myFullNameSelector = (state: RootState): string | undefined => {
  const myProfile = state.users.users[state.myProfile.userId || undefinedKey];

  return `${myProfile?.firstName} ${myProfile?.lastName}`;
};

export const myProfilePhotoSelector = (state: RootState): string | undefined =>
  state.users.users[state.myProfile.userId || undefinedKey]?.avatar?.previewUrl;

export const tabActiveSelector = (state: RootState) => state.myProfile.isTabActive;
