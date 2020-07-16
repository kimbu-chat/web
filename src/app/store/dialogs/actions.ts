import { createAction } from '../utils';
import { GetDialogsActionData, DialogsActionTypes, Dialog, GetDialogsResponse } from './types';
import { IntercolutorMessageTypingIntegrationEvent } from '../middlewares/websockets/integration-events/interlocutor-message-typing-integration-event';
import { StatusChangedIntegrationEvent } from '../middlewares/websockets/integration-events/status-changed-integration-event';
import { CreateMessageResponse, CreateMessageRequest } from '../messages/interfaces';
import { markMessagesAsReadAction } from '../messages/actions';
import {
  createConferenceSuccessAction,
  leaveConferenceSuccessAction,
  renameConferenceSuccessAction,
  addUsersToConferenceSuccessAction
} from '../conferences/actions';

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

export const interlocutorStoppedTyping = (data: IntercolutorMessageTypingIntegrationEvent) =>
  createAction(DialogsActionTypes.INTERLOCUTOR_STOPPED_TYPING, data);

export const interlocutorMessageTypingEventAction = (data: IntercolutorMessageTypingIntegrationEvent) =>
  createAction(DialogsActionTypes.INTERLOCUTOR_MESSAGE_TYPING_EVENT, data);

export const createMessageSuccessAction = (createMessageResponse: CreateMessageResponse) =>
  createAction(DialogsActionTypes.CREATE_MESSAGE_SUCCESS, createMessageResponse);

export const createMessageAction = (data: CreateMessageRequest) =>
  createAction(DialogsActionTypes.CREATE_MESSAGE, data);

export const userStatusChangedEventAction = (data: StatusChangedIntegrationEvent) =>
  createAction(DialogsActionTypes.USER_STATUS_CHANGED_EVENT, data);

export type DialogActions =
  | typeof getDialogsAction
  | typeof changeSelectedDialogAction
  | typeof getDialogsSuccessAction
  | typeof getDialogsFailureAction
  | typeof removeDialogAction
  | typeof removeDialogSuccessAction
  | typeof muteDialogAction
  | typeof muteDialogSuccessAction
  | typeof unsetSelectedDialogAction
  | typeof interlocutorStoppedTyping
  | typeof interlocutorMessageTypingEventAction
  | typeof createMessageSuccessAction
  | typeof createMessageAction
  | typeof userStatusChangedEventAction
  | typeof createConferenceSuccessAction
  | typeof markMessagesAsReadAction
  | typeof leaveConferenceSuccessAction
  | typeof renameConferenceSuccessAction
  | typeof addUsersToConferenceSuccessAction;
