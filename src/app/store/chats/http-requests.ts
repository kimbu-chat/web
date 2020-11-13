import { httpRequestFactory, HttpRequestMethod } from '../common/http-factory';
import { AxiosResponse } from 'axios';
import {
	Chat,
	GetChatsRequestData,
	HideChatRequest,
	MuteChatRequest,
	GetConferenceUsersRequest,
	RenameConferenceApiRequest,
	ConferenceCreationHTTPReqData,
	UploadAudioResponse,
	UploadFileResponse,
	UploadPictureResponse,
	UploadVideoResponse,
	UploadVoiceResponse,
	AudioAttachment,
	IGroupable,
	GetChatAudiosHTTPRequest,
	PictureAttachment,
	GetChatPicturesHTTPRequest,
	RawAttachment,
	GetChatFilesHTTPRequest,
	VideoAttachment,
	GetChatVideosHTTPRequest,
	GetChatByIdRequestData,
	MarkMessagesAsReadRequest,
	GetChatInfoRequest,
	GetChatInfoApiResponse,
} from './models';
import { ApiBasePath } from '../root-api';
import { UserPreview } from '../my-profile/models';
import { httpFilesRequestFactory } from '../common/http-file-factory';

export const ChatHttpRequests = {
	getChats: httpRequestFactory<AxiosResponse<Chat[]>, GetChatsRequestData>(
		`${ApiBasePath.MainApi}/api/chats/search`,
		HttpRequestMethod.Post,
	),
	getChatById: httpRequestFactory<AxiosResponse<Chat>, GetChatByIdRequestData>(
		({ chatId }: GetChatByIdRequestData) => `${ApiBasePath.MainApi}/api/chats/${chatId}`,
		HttpRequestMethod.Get,
	),
	markMessagesAsRead: httpRequestFactory<AxiosResponse, MarkMessagesAsReadRequest>(
		`${ApiBasePath.MainApi}/api/chats/mark-as-read`,
		HttpRequestMethod.Post,
	),
	changeChatVisibilityState: httpRequestFactory<AxiosResponse, HideChatRequest>(
		`${ApiBasePath.MainApi}​/api/chats/change-hidden-status`,
		HttpRequestMethod.Put,
	),
	muteChat: httpRequestFactory<AxiosResponse, MuteChatRequest>(
		`${ApiBasePath.MainApi}/api/chats/change-muted-status`,
		HttpRequestMethod.Put,
	),
	getChatInfo: httpRequestFactory<AxiosResponse<GetChatInfoApiResponse>, GetChatInfoRequest>(
		({ chatId }: GetChatInfoRequest) => `${ApiBasePath.MainApi}/api/chats/${chatId}/info`,
		HttpRequestMethod.Get,
	),
	createConference: httpRequestFactory<AxiosResponse<number>, ConferenceCreationHTTPReqData>(
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
	//attachment lists
	getChatAudioAttachments: httpRequestFactory<
		AxiosResponse<Array<AudioAttachment & IGroupable>>,
		GetChatAudiosHTTPRequest
	>(`${ApiBasePath.MainApi}/api/audio-attachments/search`, HttpRequestMethod.Post),

	getChatPictureAttachments: httpRequestFactory<
		AxiosResponse<Array<PictureAttachment & IGroupable>>,
		GetChatPicturesHTTPRequest
	>(`${ApiBasePath.MainApi}/api/picture-attachments/search`, HttpRequestMethod.Post),

	getChatRawAttachments: httpRequestFactory<
		AxiosResponse<Array<RawAttachment & IGroupable>>,
		GetChatFilesHTTPRequest
	>(`${ApiBasePath.MainApi}/api/raw-attachments/search`, HttpRequestMethod.Post),

	getChatVideoAttachments: httpRequestFactory<
		AxiosResponse<Array<VideoAttachment & IGroupable>>,
		GetChatVideosHTTPRequest
	>(`${ApiBasePath.MainApi}/api/video-attachments/search`, HttpRequestMethod.Post),
};

export const ChatHttpFileRequest = {
	uploadAudioAttachment: httpFilesRequestFactory<AxiosResponse<UploadAudioResponse>, FormData>(
		`${ApiBasePath.FilesAPI}/api/audio-attachments`,
		HttpRequestMethod.Post,
	),
	uploadPictureAttachment: httpFilesRequestFactory<AxiosResponse<UploadPictureResponse>, FormData>(
		`${ApiBasePath.FilesAPI}/api/picture-attachments`,
		HttpRequestMethod.Post,
	),
	uploadFileAttachment: httpFilesRequestFactory<AxiosResponse<UploadFileResponse>, FormData>(
		`${ApiBasePath.FilesAPI}/api/raw-attachments`,
		HttpRequestMethod.Post,
	),
	uploadVideoAttachment: httpFilesRequestFactory<AxiosResponse<UploadVideoResponse>, FormData>(
		`${ApiBasePath.FilesAPI}/api/video-attachments`,
		HttpRequestMethod.Post,
	),
	uploadVoiceAttachment: httpFilesRequestFactory<AxiosResponse<UploadVoiceResponse>, FormData>(
		`${ApiBasePath.FilesAPI}/api/voice-attachments`,
		HttpRequestMethod.Post,
	),
};
