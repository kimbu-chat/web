export enum AuthActionTypes {
  SEND_PHONE_CONFIRMATION_CODE = 'SEND_PHONE_CONFIRMATION_CODE',
  SEND_PHONE_CONFIRMATION_CODE_FAILURE = 'SEND_PHONE_CONFIRMATION_CODE_FAILURE',
  SEND_PHONE_CONFIRMATION_CODE_SUCCESS = 'SEND_PHONE_CONFIRMATION_CODE_SUCCESS',

  CONFIRM_PHONE = 'CONFIRM_PHONE',
  CONFIRM_PHONE_SUCCESS = 'CONFIRM_PHONE_SUCCESS',
  CONFIRM_PHONE_FAILURE = 'CONFIRM_PHONE_FAILURE',

  GET_MY_PROFILE = 'GET_MY_PROFILE',
  GET_MY_PROFILE_SUCCESS = 'GET_MY_PROFILE_SUCCESS',

  CHANGE_ONLINE_STATUS = 'CHANGE_ONLINE_STATUS',
  CHANGE_INTERLOCUTOR_STATUS = 'CHANGE_INTERLOCUTOR_STATUS',
  USER_STATUS_CHANGED_EVENT = 'USER_STATUS_CHANGED_EVENT',

  LOGOUT = 'LOGOUT',

  LOGIN_SUCCESS = 'LOGIN_SUCCESS'
}

export interface Credentials {
  phoneNumber: string;
  code: string;
}

export interface LoginApiResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
}

export interface UserAuthData {
  accessToken: string;
  userId: number;
  refreshToken: string;
}

export interface PhoneConfirmationActionData {
  phoneNumber: string;
  code: string;
}

export interface SendSmsCodeActionData {
  phoneNumber: string;
}

export interface PhoneConfirmationApiResponse {
  isCodeCorrect: boolean;
  userExists: boolean;
}
