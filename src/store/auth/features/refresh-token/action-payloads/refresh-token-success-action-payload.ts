export interface IRefreshTokenSuccessActionPayload {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpirationTime?: Date;
}
