import { RootState } from 'app/store/root-reducer';
import { ISecurityTokens } from './models';

export const selectSecurityTokensSelector = (state: RootState): ISecurityTokens => state.auth.securityTokens;

export const amIAuthenticatedSelector = (state: RootState): boolean => state.auth.isAuthenticated;

export const getAuthPhoneNumberSelector = (state: RootState): string => state.auth.phoneNumber;

export const getConfirmationCodeSelector = (state: RootState): string => state.auth.confirmationCode;

export const getRegstrationAllowedSelector = (state: RootState) => state.auth.registrationAllowed;

export const getTwoLetterCountryCodeSelector = (state: RootState): string => state.auth.twoLetterCountryCode;

export const getAuthIsLoadingSelector = (state: RootState): boolean => state.auth.loading;

export const getIsConfirmationCodeWrongSelector = (state: RootState) => state.auth.isConfirmationCodeWrong;
