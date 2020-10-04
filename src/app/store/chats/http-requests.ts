import { httpRequestFactory, HttpRequestMethod } from '../common/http-factory';
import { AxiosResponse } from 'axios';
import {
	Chat,
	GetChatsRequestData,
	HideChatRequest,
	MuteChatRequest,
	GetConferenceUsersRequest,
	RenameConferenceApiRequest,
	ConferenceCreationReqData,
} from './models';
import { ApiBasePath } from '../root-api';
import { UserPreview } from '../my-profile/models';

export const ChatHttpRequests = {
	getChats: httpRequestFactory<AxiosResponse<Chat[]>, GetChatsRequestData>(
		`${ApiBasePath.MainApi}/api/chats/search`,
		HttpRequestMethod.Post,
	),
	removeChat: httpRequestFactory<AxiosResponse, HideChatRequest>(
		`${ApiBasePath.MainApi}​/api/chats/change-hidden-status`,
		HttpRequestMethod.Put,
	),
	muteChat: httpRequestFactory<AxiosResponse, MuteChatRequest>(
		`${ApiBasePath.MainApi}/api/chats/change-muted-status`,
		HttpRequestMethod.Put,
	),
	createConference: httpRequestFactory<AxiosResponse<number>, ConferenceCreationReqData>(
		`${ApiBasePath.MainApi}/api/conferences`,
		HttpRequestMethod.Post,
	),
	getConferenceMembers: httpRequestFactory<AxiosResponse<Array<UserPreview>>, GetConferenceUsersRequest>(
		`${ApiBasePath.MainApi}/api/conferences/members`,
		HttpRequestMethod.Post,
	),
	leaveConferece: httpRequestFactory<AxiosResponse, number>(
		(id: number) => `${ApiBasePath.MainApi}/api/conferences?id=${id}`,
		HttpRequestMethod.Delete,
	),
	addMembersIntoConference: httpRequestFactory<AxiosResponse, { conferenceId: number; userIds: number[] }>(
		`${ApiBasePath.MainApi}/api/conferences/users`,
		HttpRequestMethod.Post,
	),
	renameConference: httpRequestFactory<AxiosResponse, RenameConferenceApiRequest>(
		`${ApiBasePath.MainApi}/api/conference`,
		HttpRequestMethod.Put,
	),
};
