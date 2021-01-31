import { AuthService } from 'app/services/auth-service';
import { createReducer } from 'typesafe-actions';
import { ConfirmPhoneFailure } from './features/confirm-phone/confirm-phone-failure';
import { LoginSuccess } from './features/login/login-success';
import { IAuthState } from './auth-state';
import { SendSmsCodeSuccess } from './features/send-sms-code/send-sms-code-success';
import { SendSmsCode } from './features/send-sms-code/send-sms-code';
import { ConfirmPhone } from './features/confirm-phone/confirm-phone';
import { Register } from './features/register/register';
import { ReSendSmsCode } from './features/send-sms-code/re-send-sms-code';
import { ConfirmPhoneSuccess } from './features/confirm-phone/confirm-phone-success';
import { Logout } from './features/logout/logout';
import { RefreshToken } from './features/refresh-token/refresh-token';
import { RefreshTokenSuccess } from './features/refresh-token/refresh-token-success';
import { RefreshTokenFailure } from './features/refresh-token/refresh-token-failure';

const authService = new AuthService();
const securityTokens = authService?.securityTokens;

const initialState: IAuthState = {
  loading: false,
  confirmationCode: '',
  twoLetterCountryCode: '',
  phoneNumber: '',
  isConfirmationCodeWrong: false,
  isAuthenticated: Boolean(securityTokens),
  securityTokens,
  refreshTokenRequestLoading: false,
};

const auth = createReducer<IAuthState>(initialState)
  .handleAction(SendSmsCode.action, SendSmsCode.reducer)
  .handleAction(LoginSuccess.action, LoginSuccess.reducer)
  .handleAction(SendSmsCodeSuccess.action, SendSmsCodeSuccess.reducer)
  .handleAction(ConfirmPhone.action, ConfirmPhone.reducer)
  .handleAction(ConfirmPhoneSuccess.action, ConfirmPhoneSuccess.reducer)
  .handleAction(ConfirmPhoneFailure.action, ConfirmPhoneFailure.reducer)
  .handleAction(Register.action, Register.reducer)
  .handleAction(ReSendSmsCode.action, ReSendSmsCode.reducer)
  .handleAction(Logout.action, Logout.reducer)
  .handleAction(RefreshToken.action, RefreshToken.reducer)
  .handleAction(RefreshTokenSuccess.action, RefreshTokenSuccess.reducer)
  .handleAction(RefreshTokenFailure.action, RefreshTokenFailure.reducer);

export default auth;
