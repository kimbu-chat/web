import { ILoginApiResponse } from './features/confirm-phone/api-requests/login-api-response';

export interface ISecurityTokens extends ILoginApiResponse {
  refreshTokenRequestLoading?: boolean;
  isAuthenticated?: boolean;
}

export interface IAuthState {
  loading: boolean;
  confirmationCode: string;
  twoLetterCountryCode: string;
  phoneNumber: string;
  isConfirmationCodeWrong: boolean;
  isAuthenticated: boolean;
  securityTokens: ISecurityTokens;
  registrationAllowed?: boolean;
}
