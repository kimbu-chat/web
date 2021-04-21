import { createReducer } from 'typesafe-actions';
import { AuthService } from '../../services/auth-service';
import { ConfirmPhoneFailure } from './features/confirm-phone/confirm-phone-failure';
import { LoginSuccess } from './features/login/login-success';
import { IAuthState } from './auth-state';
import { SendSmsCodeSuccess } from './features/send-sms-code/send-sms-code-success';
import { SendSmsCode } from './features/send-sms-code/send-sms-code';
import { ConfirmPhone } from './features/confirm-phone/confirm-phone';
import { Register } from './features/register/register';
import { ConfirmPhoneSuccess } from './features/confirm-phone/confirm-phone-success';
import { Logout } from './features/logout/logout';
import { RefreshToken } from './features/refresh-token/refresh-token';
import { RefreshTokenSuccess } from './features/refresh-token/refresh-token-success';

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
  deviceId: authService.deviceId?.deviceId,
};

const reducer = createReducer<IAuthState>(initialState)
  .handleAction(SendSmsCode.action, SendSmsCode.reducer)
  .handleAction(LoginSuccess.action, LoginSuccess.reducer)
  .handleAction(SendSmsCodeSuccess.action, SendSmsCodeSuccess.reducer)
  .handleAction(ConfirmPhone.action, ConfirmPhone.reducer)
  .handleAction(ConfirmPhoneSuccess.action, ConfirmPhoneSuccess.reducer)
  .handleAction(ConfirmPhoneFailure.action, ConfirmPhoneFailure.reducer)
  .handleAction(Register.action, Register.reducer)
  .handleAction(Logout.action, Logout.reducer)
  .handleAction(RefreshToken.action, RefreshToken.reducer)
  .handleAction(RefreshTokenSuccess.action, RefreshTokenSuccess.reducer);

export default reducer;
