import { AxiosResponse } from 'axios';
import { httpRequestFactory, HttpRequestMethod } from '../common/http-factory';
import { UserPreview, GetFriendsActionData } from '../my-profile/models';
import { ApiBasePath } from '../root-api';
import { DeleteFriendsActionData } from './models';

export const FriendsHttpRequests = {
	getFriends: httpRequestFactory<AxiosResponse<UserPreview[]>, GetFriendsActionData>(
		`${ApiBasePath.MainApi}/api/contacts/search`,
		HttpRequestMethod.Post,
	),
	deleteFriend: httpRequestFactory<AxiosResponse, DeleteFriendsActionData>(
		`${ApiBasePath.MainApi}/api/contacts`,
		HttpRequestMethod.Delete,
	),
};
