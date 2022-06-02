export interface ILoginState {
  loading: boolean;
  confirmationCode: string;
  twoLetterCountryCode: string;
  phoneNumber: string;
  isConfirmationCodeWrong: boolean;
  isAuthenticated: boolean;
  googleAuthIdToken?: string;
  googleAuthLoading?: boolean;
  loginSource?: 'phone-number' | 'google' | undefined;
}
