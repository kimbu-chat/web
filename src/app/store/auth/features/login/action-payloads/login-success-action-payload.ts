export interface ILoginSuccessActionPayload {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpirationTime?: Date;
}
