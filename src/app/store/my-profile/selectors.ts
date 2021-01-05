import { IUserPreview } from '../models';
import { RootState } from '../root-reducer';

export const getMyIdSelector = (state: RootState): number | undefined => state.myProfile.user?.id;

export const getMyProfileSelector = (state: RootState): IUserPreview | undefined => state.myProfile.user;

export const getMyPhoneNumberSelector = (state: RootState): string | undefined => state.myProfile.user?.phoneNumber;

export const getMyFullNameSelector = (state: RootState): string | undefined => `${state.myProfile.user?.firstName} ${state.myProfile.user?.lastName}`;
