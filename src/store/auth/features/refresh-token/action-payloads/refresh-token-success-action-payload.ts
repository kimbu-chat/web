export interface IRefreshTokenSuccessActionPayload {
  accessToken: string;
  accessTokenExpirationTime: Date;
  refreshToken: string;
  refreshTokenExpirationTime: Date;
}
