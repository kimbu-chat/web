import { all, takeLatest } from 'redux-saga/effects';

import { LoginFromGoogleAccountSuccess } from '@store/login/features/login-from-google-account/login-from-google-account-success';
import { LoginFromGoogleAccount } from '@store/login/features/login-from-google-account/login-from-google-account';

import { ConfirmPhone } from './features/confirm-phone/confirm-phone';
import { LoginSuccess } from './features/login/login-success';
import { Login } from './features/login/login';
import { RegisterFromGoogleAccount } from './features/register-from-google-account/register-from-google-account';
import { Register } from './features/register/register';
import { SendSmsCode } from './features/send-sms-code/send-sms-code';

export function* loginSaga() {
  yield all([
    takeLatest(ConfirmPhone.action, ConfirmPhone.saga),
    takeLatest(SendSmsCode.action, SendSmsCode.saga),
    takeLatest(Register.action, Register.saga),
    takeLatest(Login.action, Login.saga),
    takeLatest(LoginSuccess.action, LoginSuccess.saga),

    takeLatest(RegisterFromGoogleAccount.action, RegisterFromGoogleAccount.saga),
    takeLatest(LoginFromGoogleAccount.action, LoginFromGoogleAccount.saga),
    takeLatest(LoginFromGoogleAccountSuccess.action, LoginFromGoogleAccountSuccess.saga),
  ]);
}
