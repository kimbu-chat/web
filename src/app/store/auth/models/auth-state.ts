import { ISecurityTokens } from './security-tokens';

export interface IAuthState {
  loading: boolean;
  confirmationCode: string;
  twoLetterCountryCode: string;
  phoneNumber: string;
  isConfirmationCodeWrong: boolean;
  isAuthenticated: boolean;
  securityTokens: ISecurityTokens | undefined;
  registrationAllowed?: boolean;
  refreshTokenRequestLoading: boolean;
}
