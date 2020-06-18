import { api, ENDPOINTS } from 'app/api';
import { Credentials, PhoneConfirmationActionData, LoginApiResponse } from './types';

export const loginApi = (credentials: Credentials) => api.post<LoginApiResponse>(ENDPOINTS.LOGIN, credentials);

export const sendSmsConfirmationCodeApi = (phoneNumber: string) =>
  api.post<string>(ENDPOINTS.SEND_SMS_CONFIRMATION_CODE, { phoneNumber });

export const confirmPhoneApi = (data: PhoneConfirmationActionData) => api.post(ENDPOINTS.CONFIRM_PHONE, data);

export const changeOnlineStatusApi = (isOnline: boolean) =>
  api.post(ENDPOINTS.CHANGE_ONLINE_STATUS, { isOnline: isOnline });
