import { RootState } from '../root-reducer';
import { IUserPreview } from './models';

export const getMyIdSelector = (state: RootState): number | undefined => state.myProfile.user?.id;

export const getMyProfileSelector = (state: RootState): IUserPreview | undefined => state.myProfile.user;

export const getMyPhoneNumber = (state: RootState): string | undefined => state.myProfile.user?.phoneNumber;

export const getMyFullNameSelector = (state: RootState): string | undefined => `${state.myProfile.user?.firstName} ${state.myProfile.user?.lastName}`;
