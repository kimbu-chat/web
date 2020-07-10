import {
  ConferenceCreationReqData as ConferenceCreationRequest,
  GetConferenceUsersRequest,
  RenameConferenceApiRequest
} from '../dialogs/types';
import { api, ENDPOINTS } from 'app/api';

export const createConfereceApi = (data: ConferenceCreationRequest) => api.post(ENDPOINTS.CREATE_CONFERENCE, data);
export const getConferenceUsersApi = (data: GetConferenceUsersRequest) =>
  api.post(ENDPOINTS.GET_CONFERENCE_USERS, data);
export const leaveConfereceApi = (conferenceId: number) =>
  api.delete(`${ENDPOINTS.LEAVE_CONFERENCE}?id=${conferenceId}`);
export const addUsersToConferenceApi = (data: { conferenceId: number; userIds: number[] }) =>
  api.post(ENDPOINTS.ADD_USERS_TO_CONFERENCE, data);
export const renameConferenceApi = (request: RenameConferenceApiRequest) =>
  api.put(ENDPOINTS.RENAME_CONFERENCE, request);
