export interface ISecurityTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpirationTime?: Date;
}
