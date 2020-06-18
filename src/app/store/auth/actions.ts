import { createAction } from '../utils';
import { AuthActionTypes, SendSmsCodeActionData, PhoneConfirmationActionData } from './types';

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

export type AuthActions =
  | typeof sendSmsPhoneConfirmationCodeAction
  | typeof sendSmsPhoneConfirmationCodeFailureAction
  | typeof sendSmsPhoneConfirmationCodeSuccessAction
  | typeof confirmPhoneAction
  | typeof confirmPhoneSuccessAction
  | typeof confirmPhoneFailureAction;
