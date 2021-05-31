import { createReducer } from 'typesafe-actions';

import { AuthService } from '../../services/auth-service';

import { ConfirmPhoneFailure } from './features/confirm-phone/confirm-phone-failure';
import { ILoginState } from './login-state';
import { SendSmsCodeSuccess } from './features/send-sms-code/send-sms-code-success';
import { SendSmsCode } from './features/send-sms-code/send-sms-code';
import { ConfirmPhone } from './features/confirm-phone/confirm-phone';
import { Register } from './features/register/register';
import { ConfirmPhoneSuccess } from './features/confirm-phone/confirm-phone-success';
import { LoginSuccess } from './features/login/login-success';

const authService = new AuthService();
const securityTokens = authService?.securityTokens;

const initialState: ILoginState = {
  loading: false,
  confirmationCode: '',
  twoLetterCountryCode: '',
  phoneNumber: '',
  isConfirmationCodeWrong: false,
  isAuthenticated: Boolean(securityTokens),
  securityTokens,
  refreshTokenRequestLoading: false,
  deviceId: authService.deviceId,
};

const reducer = createReducer<ILoginState>(initialState)
  .handleAction(SendSmsCode.action, SendSmsCode.reducer)
  .handleAction(SendSmsCodeSuccess.action, SendSmsCodeSuccess.reducer)
  .handleAction(ConfirmPhone.action, ConfirmPhone.reducer)
  .handleAction(ConfirmPhoneSuccess.action, ConfirmPhoneSuccess.reducer)
  .handleAction(ConfirmPhoneFailure.action, ConfirmPhoneFailure.reducer)
  .handleAction(Register.action, Register.reducer)
  .handleAction(LoginSuccess.action, LoginSuccess.reducer);

export default reducer;
