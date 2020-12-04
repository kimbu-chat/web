export interface Credentials {
  phoneNumber: string;
  code: string;
}

export interface LoginApiResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
}

export interface PhoneConfirmationData {
  phoneNumber: string;
  code: string;
}

export interface PhoneConfirmationActionData {
  phoneNumber: string;
  code: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpirationTime?: Date;
}

export interface SecurityTokens extends LoginResponse {
  refreshTokenRequestLoading?: boolean;
  isAuthenticated?: boolean;
}

export interface SendSmsCodeActionData {
  phoneNumber: string;
}

export interface PhoneConfirmationApiResponse {
  isCodeCorrect: boolean;
  userExists: boolean;
}

export interface SubscribeToPushNotificationsRequest {
  tokenId: string;
  deviceId: string;
}

export interface AuthState {
  loading: boolean;
  confirmationCode: string;
  phoneNumber: string;
  isConfirmationCodeWrong: boolean;
  isAuthenticated: boolean;
  securityTokens: SecurityTokens;
}
