export interface IPhoneConfirmationData {
  phoneNumber: string;
  code: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpirationTime?: Date;
}

export interface ISecurityTokens extends ILoginResponse {
  refreshTokenRequestLoading?: boolean;
  isAuthenticated?: boolean;
}

export interface IPhoneConfirmationApiResponse {
  isCodeCorrect: boolean;
  userExists: boolean;
}

export interface ISubscribeToPushNotificationsRequest {
  tokenId: string;
  deviceId: string;
}

export interface IAuthState {
  loading: boolean;
  confirmationCode: string;
  twoLetterCountryCode: string;
  phoneNumber: string;
  isConfirmationCodeWrong: boolean;
  isAuthenticated: boolean;
  securityTokens: ISecurityTokens;
  registrationAllowed?: boolean;
}

export interface IRegisterApiRequest {
  lastName: string;
  firstName: string;
  nickname: string;
  twoLetterCountryCode: string;
  phoneNumber: string;
  avatarId?: number;
}
