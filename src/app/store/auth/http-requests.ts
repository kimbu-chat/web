import { AxiosResponse } from 'axios';
import {
	LoginResponse,
	PhoneConfirmationData,
	PhoneConfirmationApiResponse,
	SubscribeToPushNotificationsRequest,
} from './types';
import { authRequestFactory, HttpRequestMethod } from '../common/http-factory';
import { ApiBasePath } from '../root-api';

export const AuthHttpRequests = {
	login: authRequestFactory<AxiosResponse<LoginResponse>, PhoneConfirmationData>(
		`${ApiBasePath.MainApi}/api/users/login`,
		HttpRequestMethod.Post,
	),
	refreshToken: authRequestFactory<AxiosResponse<LoginResponse>, { refreshToken: string }>(
		`${ApiBasePath.MainApi}/api/users/refresh`,
		HttpRequestMethod.Post,
	),
	confirmPhone: authRequestFactory<AxiosResponse<PhoneConfirmationApiResponse>, PhoneConfirmationData>(
		`${ApiBasePath.MainApi}/api/users/verify-sms-code`,
		HttpRequestMethod.Post,
	),
	sendSmsConfirmationCode: authRequestFactory<AxiosResponse<string>, { phoneNumber: string }>(
		`${ApiBasePath.MainApi}/api/users/send-sms-confirmation-code`,
		HttpRequestMethod.Post,
	),
	subscribeToPushNotifications: authRequestFactory<AxiosResponse, SubscribeToPushNotificationsRequest>(
		`${ApiBasePath.NotificationsApi}/api/notifications/subscribe`,
		HttpRequestMethod.Post,
	),
	unsubscribeFromPushNotifications: authRequestFactory<AxiosResponse, SubscribeToPushNotificationsRequest>(
		`${ApiBasePath.NotificationsApi}/api/notifications/unsubscribe`,
		HttpRequestMethod.Post,
	),
};
