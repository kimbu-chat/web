import { createAction } from '../utils';
import { AuthActionTypes, SendSmsCodeActionData, PhoneConfirmationActionData, UserAuthData } from './types';
import { UserPreview } from '../contacts/types';

export const sendSmsPhoneConfirmationCodeAction = (actionData: SendSmsCodeActionData) =>
  createAction(AuthActionTypes.SEND_PHONE_CONFIRMATION_CODE, actionData);
export const sendSmsPhoneConfirmationCodeFailureAction = () =>
  createAction(AuthActionTypes.SEND_PHONE_CONFIRMATION_CODE_FAILURE);
export const sendSmsPhoneConfirmationCodeSuccessAction = (code: string) =>
  createAction(AuthActionTypes.SEND_PHONE_CONFIRMATION_CODE_SUCCESS, code);

export const confirmPhoneAction = (data: PhoneConfirmationActionData) =>
  createAction(AuthActionTypes.CONFIRM_PHONE, data);
export const confirmPhoneSuccessAction = () => createAction(AuthActionTypes.CONFIRM_PHONE_SUCCESS);
export const confirmPhoneFailureAction = () => createAction(AuthActionTypes.CONFIRM_PHONE_FAILURE);

export const getMyProfileAction = () => createAction(AuthActionTypes.GET_MY_PROFILE);
export const getMyProfileSuccessAction = (data: UserPreview) =>
  createAction(AuthActionTypes.GET_MY_PROFILE_SUCCESS, data);

export const loginSuccessAction = (userAuthData: UserAuthData) =>
  createAction(AuthActionTypes.LOGIN_SUCCESS, userAuthData);

export const logoutAction = () => createAction(AuthActionTypes.LOGOUT);

export type AuthActions =
  | typeof sendSmsPhoneConfirmationCodeAction
  | typeof sendSmsPhoneConfirmationCodeFailureAction
  | typeof sendSmsPhoneConfirmationCodeSuccessAction
  | typeof confirmPhoneAction
  | typeof confirmPhoneSuccessAction
  | typeof confirmPhoneFailureAction
  | typeof getMyProfileAction
  | typeof getMyProfileSuccessAction
  | typeof loginSuccessAction
  | typeof logoutAction;
