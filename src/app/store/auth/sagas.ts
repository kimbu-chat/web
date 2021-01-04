import { takeLatest } from 'redux-saga/effects';
import { Logout } from './features/logout/logout';
import { ConfirmPhone } from './features/confirm-phone/confirm-phone';
import { RefreshToken } from './features/refresh-token/refresh-token';
import { SendSmsCode } from './features/send-sms-code/send-sms-code';
import { ReSendSmsCode } from './features/send-sms-code/re-send-sms-code';
import { Register } from './features/register/register';

export const AuthSagas = [
  takeLatest(Logout.action, Logout.saga),
  takeLatest(RefreshToken.action, RefreshToken.saga),
  takeLatest(ConfirmPhone.action, ConfirmPhone.saga),
  takeLatest(SendSmsCode.action, SendSmsCode.saga),
  takeLatest(ReSendSmsCode.action, ReSendSmsCode.saga),
  takeLatest(Register.action, Register.saga),
];
