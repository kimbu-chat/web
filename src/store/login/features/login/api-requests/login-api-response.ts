export interface ILoginApiResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpirationTime: Date;
}
