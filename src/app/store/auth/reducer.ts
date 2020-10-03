import { SecurityTokens } from './types';
import { AuthActions } from './actions';
import { AuthService } from 'app/services/auth-service';
import produce from 'immer';
import { createReducer } from 'typesafe-actions';

export interface AuthState {
	loading: boolean;
	confirmationCode: string;
	phoneNumber: string;
	isConfirmationCodeWrong: boolean;
	isAuthenticated: boolean;
	securityTokens: SecurityTokens;
}

const authService = new AuthService();
const securityTokens = authService?.securityTokens;

const initialState: AuthState = {
	loading: false,
	confirmationCode: '',
	phoneNumber: '',
	isConfirmationCodeWrong: false,
	isAuthenticated: securityTokens ? true : false,
	securityTokens: securityTokens,
};

const auth = createReducer<AuthState>(initialState)
	.handleAction(
		AuthActions.sendSmsCode,
		produce((draft: AuthState, { payload }: ReturnType<typeof AuthActions.sendSmsCode>) => {
			return {
				...draft,
				loading: true,
				isConfirmationCodeWrong: false,
				phoneNumber: payload.phoneNumber,
			};
		}),
	)
	.handleAction(
		AuthActions.loginSuccess,
		produce((draft: AuthState, { payload }: ReturnType<typeof AuthActions.loginSuccess>) => {
			return {
				...draft,
				isAuthenticated: true,
				securityTokens: payload,
			};
		}),
	)
	.handleAction(
		AuthActions.sendSmsCodeSuccess,
		produce((draft: AuthState, { payload }: ReturnType<typeof AuthActions.sendSmsCodeSuccess>) => {
			return {
				...draft,
				loading: false,
				confirmationCode: payload,
			};
		}),
	)
	.handleAction(
		AuthActions.confirmPhoneFailure,
		produce((draft: AuthState) => {
			return {
				...draft,
				loading: false,
				isConfirmationCodeWrong: true,
			};
		}),
	);

export default auth;
