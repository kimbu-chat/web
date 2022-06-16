import { LoginFromGoogleAccount } from '@store/login/features/login-from-google-account/login-from-google-account';
import { RegisterFromGoogleAccount } from '@store/login/features/register-from-google-account/register-from-google-account';

import { ConfirmPhone } from './features/confirm-phone/confirm-phone';
import { Register } from './features/register/register';
import { SendSmsCode } from './features/send-sms-code/send-sms-code';

// AuthActions
export const loginFromGoogleAccountAction = LoginFromGoogleAccount.action;

export const sendSmsCodeAction = SendSmsCode.action;
export const confirmPhoneAction = ConfirmPhone.action;
export const registerAction = Register.action;
export const registerFromGoogleAction = RegisterFromGoogleAccount.action;
