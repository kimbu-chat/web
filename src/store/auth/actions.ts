import { ConfirmPhone } from './features/confirm-phone/confirm-phone';
import { ConfirmPhoneFailure } from './features/confirm-phone/confirm-phone-failure';
import { ConfirmPhoneSuccess } from './features/confirm-phone/confirm-phone-success';
import { LoginSuccess } from './features/login/login-success';
import { Logout } from './features/logout/logout';
import { RefreshToken } from './features/refresh-token/refresh-token';
import { RefreshTokenSuccess } from './features/refresh-token/refresh-token-success';
import { Register } from './features/register/register';
import { SendSmsCode } from './features/send-sms-code/send-sms-code';
import { SendSmsCodeFailure } from './features/send-sms-code/send-sms-code-failure';
import { SendSmsCodeSuccess } from './features/send-sms-code/send-sms-code-success';

// AuthActions
export const loginSuccessAction = LoginSuccess.action;
export const refreshTokenAction = RefreshToken.action;
export const refreshTokenSuccessAction = RefreshTokenSuccess.action;
export const sendSmsCodeAction = SendSmsCode.action;
export const sendSmsCodeFailureAction = SendSmsCodeFailure.action;
export const sendSmsCodeSuccessAction = SendSmsCodeSuccess.action;
export const confirmPhoneAction = ConfirmPhone.action;
export const confirmPhoneSuccessAction = ConfirmPhoneSuccess.action;
export const confirmPhoneFailureAction = ConfirmPhoneFailure.action;
export const logoutAction = Logout.action;
export const registerAction = Register.action;

export const AuthActions = {
  loginSuccessAction,
  refreshTokenAction,
  refreshTokenSuccessAction,
  sendSmsCodeAction,
  sendSmsCodeFailureAction,
  sendSmsCodeSuccessAction,
  confirmPhoneAction,
  confirmPhoneSuccessAction,
  confirmPhoneFailureAction,
  logoutAction,
  registerAction,
};
