import { AxiosResponse } from 'axios';
import { httpRequestFactory, HttpRequestMethod } from '../common/http-factory';
import {
	CheckNicknameActionData,
	UpdateMyProfileActionData,
	UpdateNicknameActionData,
	UploadAvatarResponse,
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
		`${ApiBasePath.MainApi}/api/users/nick-name`,
		HttpRequestMethod.Put,
	),
	changeOnlineStatus: httpRequestFactory<AxiosResponse, { isOnline: boolean }>(
		`${ApiBasePath.MainApi}/api/users/change-online-status`,
		HttpRequestMethod.Post,
	),

	getUserProfile: httpRequestFactory<AxiosResponse<UserPreview>, number>(
		(userId: number) => `${ApiBasePath.MainApi}/api/users/${userId}`,
		HttpRequestMethod.Get,
	),

	checkNicknameAvailability: httpRequestFactory<AxiosResponse<boolean>, CheckNicknameActionData>(
		(nickname: CheckNicknameActionData) =>
			`${ApiBasePath.MainApi}/api/users/check-if-nickname-is-available/${nickname.nickname}`,
		HttpRequestMethod.Get,
	),
};

export const MyProfileHttpFileRequest = {
	uploadAvatar: httpFilesRequestFactory<AxiosResponse<UploadAvatarResponse>, FormData>(
		`${ApiBasePath.FilesAPI}/api/avatars`,
		HttpRequestMethod.Post,
	),
};
