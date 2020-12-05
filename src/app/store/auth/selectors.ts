import { SecurityTokens } from './models';
import { RootState } from '../root-reducer';

export const selectSecurityTokens = (state: RootState): SecurityTokens => state.auth.securityTokens;

export const amIlogged = (state: RootState): boolean => state.auth.isAuthenticated;

export const getAuthPhoneNumber = (state: RootState): string => state.auth.phoneNumber;

export const getAuthIsLoading = (state: RootState): boolean => state.auth.loading;

export const getIsConfirmationCodeWrong = (state: RootState) => state.auth.isConfirmationCodeWrong;
