import { RootState } from 'app/store/root-reducer';
import { ISecurityTokens } from './models';

export const selectSecurityTokens = (state: RootState): ISecurityTokens => state.auth.securityTokens;

export const amIlogged = (state: RootState): boolean => state.auth.isAuthenticated;

export const getAuthPhoneNumber = (state: RootState): string => state.auth.phoneNumber;

export const getConfirmationCode = (state: RootState): string => state.auth.confirmationCode;

export const getregistrationAllowed = (state: RootState) => state.auth.registrationAllowed;

export const getTwoLetterCountryCode = (state: RootState): string => state.auth.twoLetterCountryCode;

export const getAuthIsLoading = (state: RootState): boolean => state.auth.loading;

export const getIsConfirmationCodeWrong = (state: RootState) => state.auth.isConfirmationCodeWrong;
