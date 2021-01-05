export interface IRefreshTokenApiResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpirationTime?: Date;
}
