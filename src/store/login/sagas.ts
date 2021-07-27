import { all, takeLatest } from 'redux-saga/effects';

import { ConfirmPhone } from './features/confirm-phone/confirm-phone';
import { LoginSuccess } from './features/login/login-success';
import { Login } from './features/login/login';
import { Register } from './features/register/register';
import { SendSmsCode } from './features/send-sms-code/send-sms-code';

export function* loginSaga() {
  yield all([
    takeLatest(ConfirmPhone.action, ConfirmPhone.saga),
    takeLatest(SendSmsCode.action, SendSmsCode.saga),
    takeLatest(Register.action, Register.saga),
    takeLatest(Login.action, Login.saga),
    takeLatest(LoginSuccess.action, LoginSuccess.saga),
  ]);
}
