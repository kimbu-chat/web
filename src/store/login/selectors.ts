export const authenticatedSelector = (state: RootState): boolean => state.auth.isAuthenticated;

export const authPhoneNumberSelector = (state: RootState): string => state.login.phoneNumber;

export const googleIdTokenSelector = (state: RootState) => state.login.googleAuthIdToken;

export const confirmationCodeSelector = (state: RootState): string => state.login.confirmationCode;

export const twoLetterCountryCodeSelector = (state: RootState): string =>
  state.login.twoLetterCountryCode;

export const authLoadingSelector = (state: RootState): boolean => state.login.loading;

export const confirmationCodeWrongSelector = (state: RootState) =>
  state.login.isConfirmationCodeWrong;
