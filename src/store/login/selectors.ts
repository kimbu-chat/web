import { RootState } from 'typesafe-actions';

export const authenticatedSelector = (state: RootState): boolean => state.auth.isAuthenticated;

export const authPhoneNumberSelector = (state: RootState): string => state.login.phoneNumber;

export const authPhoneNumberExistsSelector = (state: RootState): boolean =>
  state.login.phoneNumber.length > 0;

export const confirmationCodeSelector = (state: RootState): string => state.login.confirmationCode;

export const twoLetterCountryCodeSelector = (state: RootState): string =>
  state.login.twoLetterCountryCode;

export const authLoadingSelector = (state: RootState): boolean => state.login.loading;

export const confirmationCodeWrongSelector = (state: RootState) =>
  state.login.isConfirmationCodeWrong;

export const deviceIdSelector = (state: RootState) => state.auth.deviceId;
