import { api, ENDPOINTS } from 'app/api';
import { GetDialogsRequestData, HideDialogRequest, MuteDialogRequest } from './types';

export const getDialogsApi = (data: GetDialogsRequestData) => api.post(ENDPOINTS.GET_DIALOGS, data);
export const removeDialogApi = (request: HideDialogRequest) => api.put(ENDPOINTS.REMOVE_DIALOG, request);
export const muteDialogApi = (request: MuteDialogRequest) => api.put(ENDPOINTS.MUTE_DIALOG, request);
