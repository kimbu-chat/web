import { AxiosResponse } from 'axios';
import { httpRequestFactory, HttpRequestMethod } from '../common/http-factory';
import {
	CheckNicknameActionData,
	UpdateMyProfileActionData,
	UpdateNicknameActionData,
	UploadAvararResponse,
	UserPreview,
} from './models';
import { ApiBasePath } from '../root-api';
import { httpFilesRequestFactory } from '../common/http-file-factory';

export const MyProfileHttpRequests = {
	updateMyProfile: httpRequestFactory<AxiosResponse, UpdateMyProfileActionData>(
		`${ApiBasePath.MainApi}/api/users`,
		HttpRequestMethod.Put,
	),
	updateMyNickName: httpRequestFactory<AxiosResponse, UpdateNicknameActionData>(
		`${ApiBasePath.MainApi}/api/nick-name`,
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

	checkNicknameAvailability: httpRequestFactory<AxiosResponse<boolean>, CheckNicknameActionData>(
		(nickname: CheckNicknameActionData) =>
			`${ApiBasePath.MainApi}/api/is-nick-name-available?nickname=${nickname.nickname}`,
		HttpRequestMethod.Get,
	),
};

export const MyProfileHttpFileRequest = {
	uploadAvatar: httpFilesRequestFactory<AxiosResponse<UploadAvararResponse>, FormData>(
		`${ApiBasePath.FilesAPI}/api/avatars`,
		HttpRequestMethod.Post,
	),
};
