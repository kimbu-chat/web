import { LoginFromGoogleAccount } from '@store/login/features/login-from-google-account/login-from-google-account';
import { RegisterFromGoogleAccount } from '@store/login/features/register-from-google-account/register-from-google-account';

import { ConfirmPhoneFailure } from './features/confirm-phone/confirm-phone-failure';
import { ConfirmPhoneSuccess } from './features/confirm-phone/confirm-phone-success';
import { ConfirmPhone } from './features/confirm-phone/confirm-phone';
import { LoginFromGoogleAccountSuccess } from './features/login-from-google-account/login-from-google-account-success';
import { LoginSuccess } from './features/login/login-success';
import { Register } from './features/register/register';
import { SendSmsCodeFailure } from './features/send-sms-code/send-sms-code-failure';
import { SendSmsCodeSuccess } from './features/send-sms-code/send-sms-code-success';
import { SendSmsCode } from './features/send-sms-code/send-sms-code';

// AuthActions
export const loginFromGoogleAccountSuccessAction = LoginFromGoogleAccountSuccess.action;
export const loginFromGoogleAccountAction = LoginFromGoogleAccount.action;

export const sendSmsCodeAction = SendSmsCode.action;
export const sendSmsCodeFailureAction = SendSmsCodeFailure.action;
export const sendSmsCodeSuccessAction = SendSmsCodeSuccess.action;
export const confirmPhoneAction = ConfirmPhone.action;
export const confirmPhoneSuccessAction = ConfirmPhoneSuccess.action;
export const confirmPhoneFailureAction = ConfirmPhoneFailure.action;
export const registerAction = Register.action;
export const registerFromGoogleAction = RegisterFromGoogleAccount.action;
export const loginSuccessAction = LoginSuccess.action;

export type LoginActions = typeof sendSmsCodeAction &
  typeof sendSmsCodeFailureAction &
  typeof sendSmsCodeSuccessAction &
  typeof confirmPhoneAction &
  typeof confirmPhoneSuccessAction &
  typeof confirmPhoneFailureAction &
  typeof registerAction &
  typeof loginSuccessAction;
