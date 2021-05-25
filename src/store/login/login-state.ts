import { ISecurityTokens } from '../auth/common/models';

export interface ILoginState {
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
