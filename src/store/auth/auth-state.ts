import { ISecurityTokens } from './common/models';

export interface IAuthState {
  loading: boolean;
  isAuthenticated: boolean;
  securityTokens?: ISecurityTokens;
  deviceId?: string;
  refreshTokenRequestLoading: boolean;
}
