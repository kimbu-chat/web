import { takeLatest, takeLeading } from 'redux-saga/effects';
import { Logout } from './features/logout/logout';
import { ConfirmPhone } from './features/confirm-phone/confirm-phone';
import { RefreshToken } from './features/refresh-token/refresh-token';
import { SendSmsCode } from './features/send-sms-code/send-sms-code';
import { Register } from './features/register/register';
import { Login } from './features/login/login';
import { LoginSuccess } from './features/login/login-success';
import { SubscribeToPushNotifications } from './features/subscribe-to-push-notifications/subscribe-to-push-notifications';
import { UnSubscribeFromPushNotifications } from './features/un-subscribe-from-push-notifications/un-subscribe-from-push-notifications';
import { RefreshTokenFailure } from './features/refresh-token/refresh-token-failure';
import { RefreshTokenSuccess } from './features/refresh-token/refresh-token-success';

export const AuthSagas = [
  takeLatest(Logout.action, Logout.saga),
  takeLeading(RefreshToken.action, RefreshToken.saga),
  takeLeading(RefreshTokenFailure.action, RefreshTokenFailure.saga),
  takeLeading(RefreshTokenSuccess.action, RefreshTokenSuccess.saga),
  takeLatest(ConfirmPhone.action, ConfirmPhone.saga),
  takeLatest(SendSmsCode.action, SendSmsCode.saga),
  takeLatest(Register.action, Register.saga),
  takeLatest(Login.action, Login.saga),
  takeLatest(UnSubscribeFromPushNotifications.action, UnSubscribeFromPushNotifications.saga),
  takeLatest(SubscribeToPushNotifications.action, SubscribeToPushNotifications.saga),
  takeLatest(LoginSuccess.action, LoginSuccess.saga),
];
