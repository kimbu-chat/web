export interface ISecurityTokens {
  refreshTokenRequestLoading?: boolean;
  isAuthenticated?: boolean;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpirationTime?: Date;
}
