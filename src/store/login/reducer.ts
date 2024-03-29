import { createReducer } from '@reduxjs/toolkit';

import { AuthService } from '@services/auth-service';

import { ConfirmPhone } from './features/confirm-phone/confirm-phone';
import { ConfirmPhoneFailure } from './features/confirm-phone/confirm-phone-failure';
import { ConfirmPhoneSuccess } from './features/confirm-phone/confirm-phone-success';
import { LoginFromGoogleAccount } from './features/login-from-google-account/login-from-google-account';
import { LoginFromGoogleAccountSuccess } from './features/login-from-google-account/login-from-google-account-success';
import { LoginSuccess } from './features/login/login-success';
import { Register } from './features/register/register';
import { SendSmsCode } from './features/send-sms-code/send-sms-code';
import { SendSmsCodeFailure } from './features/send-sms-code/send-sms-code-failure';
import { SendSmsCodeSuccess } from './features/send-sms-code/send-sms-code-success';

import type { ILoginState } from './login-state';

const authService = new AuthService();
const securityTokens = authService?.securityTokens;

const initialState: ILoginState = {
  loading: false,
  confirmationCode: '',
  twoLetterCountryCode: '',
  phoneNumber: '',
  isConfirmationCodeWrong: false,
  googleAuthLoading: false,
  isAuthenticated: Boolean(securityTokens),
};

const reducer = createReducer<ILoginState>(initialState, (builder) =>
  builder
    .addCase(SendSmsCode.action, SendSmsCode.reducer)
    .addCase(SendSmsCodeSuccess.action, SendSmsCodeSuccess.reducer)
    .addCase(SendSmsCodeFailure.action, SendSmsCodeFailure.reducer)
    .addCase(ConfirmPhone.action, ConfirmPhone.reducer)
    .addCase(ConfirmPhoneSuccess.action, ConfirmPhoneSuccess.reducer)
    .addCase(ConfirmPhoneFailure.action, ConfirmPhoneFailure.reducer)
    .addCase(Register.action, Register.reducer)
    .addCase(LoginSuccess.action, LoginSuccess.reducer)
    .addCase(LoginFromGoogleAccount.action, LoginFromGoogleAccount.reducer)
    .addCase(LoginFromGoogleAccountSuccess.action, LoginFromGoogleAccountSuccess.reducer),
);

export default reducer;
