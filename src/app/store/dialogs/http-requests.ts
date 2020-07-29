import { httpRequestFactory, HttpRequestMethod } from "../common/http-factory";
import { AxiosResponse } from "axios";
import {
	Dialog,
	GetDialogsRequestData,
	HideDialogRequest,
	MuteDialogRequest,
	GetConferenceUsersRequest,
	RenameConferenceApiRequest,
	ConferenceCreationReqData
} from "./models";
import { ApiBasePath } from "../root-api";
import { UserPreview } from "../my-profile/models";

export const ChatHttpRequests = {
	getChats: httpRequestFactory<AxiosResponse<Dialog[]>, GetDialogsRequestData>(
		`${ApiBasePath.MainApi}/api/dialogsConferences`,
		HttpRequestMethod.Post,
	),
	removeChat: httpRequestFactory<AxiosResponse, HideDialogRequest>(
		`${ApiBasePath.MainApi}/api/dialogsConferences/changeHiddenStatus`,
		HttpRequestMethod.Put,
	),
	muteChat: httpRequestFactory<AxiosResponse, MuteDialogRequest>(
		`${ApiBasePath.MainApi}/api/dialogsConferences/changeMutedStatus`,
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
