import { SendSmsCodeActionData, PhoneConfirmationActionData, LoginResponse } from './models';
import { createAction } from 'typesafe-actions';
import { createEmptyAction, Meta } from '../common/actions';

export namespace AuthActions {
	export const loginSuccess = createAction('LOGIN_SUCCESS')<LoginResponse>();
	export const refreshToken = createEmptyAction('REFRESH_TOKEN');
	export const refreshTokenSuccess = createAction('REFRESH_TOKEN_SUCCESS')<LoginResponse>();
	export const refreshTokenFailure = createEmptyAction('REFRESH_TOKEN_FAILURE');
	export const registerSuccess = createEmptyAction('REGISTER_SUCCESS');
	export const registerFailure = createEmptyAction('REGISTER_FAILURE');
	export const sendSmsCode = createAction('SEND_PHONE_CONFIRMATION_CODE')<SendSmsCodeActionData, Meta>();
	export const sendSmsCodeFailure = createEmptyAction('SEND_PHONE_CONFIRMATION_CODE_FAILURE');
	export const sendSmsCodeSuccess = createAction('SEND_PHONE_CONFIRMATION_CODE_SUCCESS')<string>();
	export const confirmPhone = createAction('CONFIRM_PHONE')<PhoneConfirmationActionData, Meta>();
	export const confirmPhoneSuccess = createEmptyAction('CONFIRM_PHONE_SUCCESS');
	export const confirmPhoneFailure = createEmptyAction('CONFIRM_PHONE_FAILURE');
	export const logout = createEmptyAction('LOGOUT');
}
