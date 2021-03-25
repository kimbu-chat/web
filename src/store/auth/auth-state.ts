import { ISecurityTokens } from './common/models';

export interface IAuthState {
  loading: boolean;
  confirmationCode: string;
  twoLetterCountryCode: string;
  phoneNumber: string;
  isConfirmationCodeWrong: boolean;
  isAuthenticated: boolean;
  securityTokens?: ISecurityTokens;
  deviceId?: string;
  refreshTokenRequestLoading: boolean;
}
