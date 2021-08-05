import { ISecurityTokens } from 'kimbu-models';

export interface IAuthState {
  loading: boolean;
  isAuthenticated: boolean;
  securityTokens?: ISecurityTokens & { accessTokenExpirationTime?: string };
  deviceId?: string;
  refreshTokenRequestLoading: boolean;
}
