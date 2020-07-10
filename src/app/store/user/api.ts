import { api, ENDPOINTS } from 'app/api';
import { UpdateMyProfileActionData } from './interfaces';

export const updateMyProfileApi = (credentials: UpdateMyProfileActionData) =>
  api.put(ENDPOINTS.UPDATE_MY_PROFILE, credentials);
export const getUserProfileApi = (userId: number) => api.get(`${ENDPOINTS.GET_USER_PROFILE}/${userId}`);
