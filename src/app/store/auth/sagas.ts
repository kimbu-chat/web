import { takeLatest } from 'redux-saga/effects';
import { Logout } from './features/logout';
import { ConfirmPhone } from './features/confirm-phone';
import { RefreshToken } from './features/refresh-token';
import { SendSmsCode } from './features/send-sms-code';

export const AuthSagas = [
  takeLatest(Logout.action, Logout.saga),
  takeLatest(RefreshToken.action, RefreshToken.saga),
  takeLatest(ConfirmPhone.action, ConfirmPhone.saga),
  takeLatest(SendSmsCode.action, SendSmsCode.saga),
];
