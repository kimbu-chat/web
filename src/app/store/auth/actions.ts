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
export const loginSuccess = LoginSuccess.action;
export const refreshToken = RefreshToken.action;
export const refreshTokenSuccess = RefreshTokenSuccess.action;
export const sendSmsCode = SendSmsCode.action;
export const sendSmsCodeFailure = SendSmsCodeFailure.action;
export const sendSmsCodeSuccess = SendSmsCodeSuccess.action;
export const confirmPhone = ConfirmPhone.action;
export const confirmPhoneSuccess = ConfirmPhoneSuccess.action;
export const confirmPhoneFailure = ConfirmPhoneFailure.action;
export const logout = Logout.action;
export const register = Register.action;
