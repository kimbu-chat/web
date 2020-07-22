import {
  ConferenceCreationReqData,
  GetConferenceUsersRequest,
  Dialog,
  AddUsersToConferenceActionData,
  RenameConferenceActionData,
  ChangeConferenceAvatarActionData,
  ChangeConferenceAvatarSuccessActionData
} from '../dialogs/types';
import { ConferencesActionTypes } from './types';
import { createAction } from '../utils';

import { ConferenceCreatedIntegrationEvent } from '../middlewares/websockets/integration-events/conference-сreated-integration-event';
import { getConferenceUsersSuccessActionData } from '../contacts/types';

export const createConferenceAction = (data: ConferenceCreationReqData) =>
  createAction(ConferencesActionTypes.CREATE_CONFERENCE, data);
export const createConferenceSuccessAction = (data: Dialog) =>
  createAction(ConferencesActionTypes.CREATE_CONFERENCE_SUCCESS, data);

export const createConferenceFromEventAction = (data: ConferenceCreatedIntegrationEvent) =>
  createAction(ConferencesActionTypes.CREATE_CONFERENCE_FROM_EVENT, data);

export const getConferenceUsersAction = (data: GetConferenceUsersRequest) =>
  createAction(ConferencesActionTypes.GET_CONFERENCE_USERS, data);
export const getConferenceUsersSuccessAction = (data: getConferenceUsersSuccessActionData) =>
  createAction(ConferencesActionTypes.GET_CONFERENCE_USERS_SUCCESS, data);

export const unsetConferenceUsersAction = () => createAction(ConferencesActionTypes.UNSET_CONFERENCE_USERS);

export const leaveConferenceAction = (dialog: Dialog) => createAction(ConferencesActionTypes.LEAVE_CONFERENCE, dialog);
export const leaveConferenceSuccessAction = (dialog: Dialog) =>
  createAction(ConferencesActionTypes.LEAVE_CONFERENCE_SUCCESS, dialog);

export const addUsersToConferenceAction = (data: AddUsersToConferenceActionData) =>
  createAction(ConferencesActionTypes.ADD_USERS_TO_CONFERENCE, data);
export const addUsersToConferenceSuccessAction = (data: Dialog) =>
  createAction(ConferencesActionTypes.ADD_USERS_TO_CONFERENCE_SUCCESS, data);

export const renameConferenceAction = (data: RenameConferenceActionData) =>
  createAction(ConferencesActionTypes.RENAME_CONFERENCE, data);
export const renameConferenceSuccessAction = (data: RenameConferenceActionData) =>
  createAction(ConferencesActionTypes.RENAME_CONFERENCE_SUCCESS, data);

export const changeConferenceAvatarAction = (data: ChangeConferenceAvatarActionData) =>
  createAction(ConferencesActionTypes.CHANGE_CONFERENCE_AVATAR, data);
export const changeConferenceAvatarSuccessAction = (data: ChangeConferenceAvatarSuccessActionData) =>
  createAction(ConferencesActionTypes.CHANGE_CONFERENCE_AVATAR_SUCCESS, data);

export type ConferenceActions =
  | typeof createConferenceAction
  | typeof createConferenceSuccessAction
  | typeof createConferenceFromEventAction
  | typeof getConferenceUsersAction
  | typeof getConferenceUsersSuccessAction
  | typeof unsetConferenceUsersAction
  | typeof leaveConferenceAction
  | typeof leaveConferenceSuccessAction
  | typeof addUsersToConferenceAction
  | typeof addUsersToConferenceSuccessAction
  | typeof renameConferenceAction
  | typeof renameConferenceSuccessAction
  | typeof changeConferenceAvatarAction
  | typeof changeConferenceAvatarSuccessAction;
