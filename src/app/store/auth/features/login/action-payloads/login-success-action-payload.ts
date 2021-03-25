export interface ILoginSuccessActionPayload {
  securityTokens: {
    accessToken: string;
    refreshToken: string;
    refreshTokenExpirationTime?: Date;
  };
  deviceId: string;
}
