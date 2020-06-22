import { createAction } from '../utils';
import { GetDialogsActionData, DialogsActionTypes, Dialog, GetDialogsResponse } from './types';

export const getDialogsAction = (data: GetDialogsActionData) => createAction(DialogsActionTypes.GET_DIALOGS, data);

export const changeSelectedDialogAction = (data: number) =>
  createAction(DialogsActionTypes.CHANGE_SELECTED_DIALOG, data);

export const getDialogsSuccessAction = (data: GetDialogsResponse) =>
  createAction(DialogsActionTypes.GET_DIALOGS_SUCCESS, data);

export const getDialogsFailureAction = () => createAction(DialogsActionTypes.GET_DIALOGS_FAILURE);

export const removeDialogAction = (dialog: Dialog) => createAction(DialogsActionTypes.REMOVE_DIALOG, dialog);

export const removeDialogSuccessAction = (dialog: Dialog) =>
  createAction(DialogsActionTypes.REMOVE_DIALOG_SUCCESS, dialog);

export const muteDialogAction = (dialog: Dialog) => createAction(DialogsActionTypes.MUTE_DIALOG, dialog);

export const muteDialogSuccessAction = (dialog: Dialog) => createAction(DialogsActionTypes.MUTE_DIALOG_SUCCESS, dialog);

export const unsetSelectedDialogAction = () => createAction(DialogsActionTypes.UNSET_SELECTED_DIALOG);

export type DialogActions =
  | typeof getDialogsAction
  | typeof changeSelectedDialogAction
  | typeof getDialogsSuccessAction
  | typeof getDialogsFailureAction
  | typeof removeDialogAction
  | typeof removeDialogSuccessAction
  | typeof muteDialogAction
  | typeof muteDialogSuccessAction
  | typeof unsetSelectedDialogAction;
