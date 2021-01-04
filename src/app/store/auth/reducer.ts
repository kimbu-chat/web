import { AuthService } from 'app/services/auth-service';
import { createReducer } from 'typesafe-actions';
import { ConfirmPhoneFailure } from './features/confirm-phone/confirm-phone-failure';
import { ConfirmPhoneSuccess } from './features/confirm-phone/confirm-phone-success';
import { LoginSuccess } from './features/login/login-success';
import { IAuthState } from './models';
import { SendSmsCodeSuccess } from './features/send-sms-code/send-sms-code-success';
import { SendSmsCode } from './features/send-sms-code/send-sms-code';
import { ConfirmPhone } from './features/confirm-phone/confirm-phone';
import { Register } from './features/register/register';
import { ReSendSmsCode } from './features/send-sms-code/re-send-sms-code';
import { ConfirmPhoneRegistrationAllowed } from './features/confirm-phone/confirm-phone-registration-allowed';
import { Logout } from './features/logout/logout';

const authService = new AuthService();
const securityTokens = authService?.securityTokens;

const initialState: IAuthState = {
  loading: false,
  confirmationCode: '',
  twoLetterCountryCode: '',
  phoneNumber: '',
  isConfirmationCodeWrong: false,
  isAuthenticated: !!securityTokens,
  securityTokens,
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
  .handleAction(ConfirmPhoneRegistrationAllowed.action, ConfirmPhoneRegistrationAllowed.reducer)
  .handleAction(Logout.action, Logout.reducer);

export default auth;
