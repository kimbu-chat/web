import { RootState } from 'typesafe-actions';
import { IUser } from '../common/models';

export const myIdSelector = (state: RootState): number | undefined => state.myProfile.user?.id;

export const myProfileSelector = (state: RootState): IUser | undefined => state.myProfile.user;

export const myPhoneNumberSelector = (state: RootState): string | undefined => state.myProfile.user?.phoneNumber;

export const myFullNameSelector = (state: RootState): string | undefined =>
  `${state.myProfile.user?.firstName} ${state.myProfile.user?.lastName}`;

export const myProfilePhotoSelector = (state: RootState): string | undefined => state.myProfile.user?.avatar?.previewUrl;

export const tabActiveSelector = (state: RootState) => state.myProfile.isTabActive;
