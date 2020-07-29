import { AxiosResponse } from 'axios';
import { httpRequestFactory, HttpRequestMethod } from '../common/http-factory';
import { UpdateMyProfileActionData, UserPreview } from './models';
import { ApiBasePath } from '../root-api';

export const MyProfileHttpRequests = {
	updateMyProfile: httpRequestFactory<AxiosResponse, UpdateMyProfileActionData>(
		`${ApiBasePath.MainApi}/api/users`,
		HttpRequestMethod.Put,
	),
	changeOnlineStatus: httpRequestFactory<AxiosResponse, { isOnline: boolean }>(
		`${ApiBasePath.MainApi}/api/users/changeOnlineStatus`,
		HttpRequestMethod.Post,
	),

	getUserProfile: httpRequestFactory<AxiosResponse<UserPreview>, number>(
		(userId: number) => `${ApiBasePath.MainApi}/api/users/${userId}`,
		HttpRequestMethod.Get,
	),
};
