import { api, ENDPOINTS } from 'app/api';
import { GetFriendsActionData } from '../user/interfaces';

export const getFriendsApi = (data: GetFriendsActionData) => api.post(ENDPOINTS.GET_CONTACTS, data);
export const deleteFriendApi = (userId: number) => api.delete(`${ENDPOINTS.DELETE_CONTACT}?userId=${userId}`);
