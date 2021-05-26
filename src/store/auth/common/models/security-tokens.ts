export interface ISecurityTokens {
  accessToken: string;
  accessTokenExpirationTime?: Date;
  refreshToken: string;
  refreshTokenExpirationTime: Date;
}
