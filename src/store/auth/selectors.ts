import { RootState } from 'typesafe-actions';

import { ISecurityTokens } from './common/models';

export const securityTokensSelector = (state: RootState): ISecurityTokens | undefined =>
  state.auth.securityTokens;

export const authenticatedSelector = (state: RootState): boolean => state.auth.isAuthenticated;

export const authPhoneNumberSelector = (state: RootState): string => state.auth.phoneNumber;

export const authPhoneNumberExistsSelector = (state: RootState): boolean =>
  state.auth.phoneNumber.length > 0;

export const confirmationCodeSelector = (state: RootState): string => state.auth.confirmationCode;

export const twoLetterCountryCodeSelector = (state: RootState): string =>
  state.auth.twoLetterCountryCode;

export const authLoadingSelector = (state: RootState): boolean => state.auth.loading;

export const confirmationCodeWrongSelector = (state: RootState) =>
  state.auth.isConfirmationCodeWrong;

export const deviceIdSelector = (state: RootState) => state.auth.deviceId;
