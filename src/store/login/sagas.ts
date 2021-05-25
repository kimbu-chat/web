import { all, takeLatest } from 'redux-saga/effects';

import { ConfirmPhone } from './features/confirm-phone/confirm-phone';
import { SendSmsCode } from './features/send-sms-code/send-sms-code';
import { Register } from './features/register/register';
import { Login } from './features/login/login';

export function* loginSaga() {
  yield all([
    takeLatest(ConfirmPhone.action, ConfirmPhone.saga),
    takeLatest(SendSmsCode.action, SendSmsCode.saga),
    takeLatest(Register.action, Register.saga),
    takeLatest(Login.action, Login.saga),
  ]);
}
