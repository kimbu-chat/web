import { RootState } from '../root-reducer';
import { UserPreview } from './models';

export const getMyIdSelector = (state: RootState): number => state.myProfile.user?.id || -1;

export const getMyProfileSelector = (state: RootState): UserPreview | undefined => state.myProfile.user;

export const getMyPhoneNumber = (state: RootState): string | undefined => state.myProfile.user?.phoneNumber;
