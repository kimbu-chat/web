import { takeLatest, takeLeading } from 'redux-saga/effects';
import { Logout } from './features/logout/logout';
import { ConfirmPhone } from './features/confirm-phone/confirm-phone';
import { RefreshToken } from './features/refresh-token/refresh-token';
import { SendSmsCode } from './features/send-sms-code/send-sms-code';
import { ReSendSmsCode } from './features/send-sms-code/re-send-sms-code';
import { Register } from './features/register/register';
import { Login } from './features/login/login';
import { LoginSuccess } from './features/login/login-success';

export const AuthSagas = [
  takeLatest(Logout.action, Logout.saga),
  takeLeading(RefreshToken.action, RefreshToken.saga),
  takeLatest(ConfirmPhone.action, ConfirmPhone.saga),
  takeLatest(SendSmsCode.action, SendSmsCode.saga),
  takeLatest(ReSendSmsCode.action, ReSendSmsCode.saga),
  takeLatest(Register.action, Register.saga),
  takeLatest(Login.action, Login.saga),
  takeLatest(LoginSuccess.action, LoginSuccess.saga),
];
