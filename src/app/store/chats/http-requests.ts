import { AxiosResponse } from 'axios';
import { httpRequestFactory } from '../common/http-factory';
import {
  Chat,
  GetChatsRequestData,
  HideChatRequest,
  MuteChatRequest,
  GetGroupChatUsersRequest,
  GroupChatCreationHTTPReqData,
  UploadAudioResponse,
  UploadFileResponse,
  UploadPictureResponse,
  UploadVideoResponse,
  UploadVoiceResponse,
  AudioAttachment,
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
  EditGroupChatHTTPReqData,
  GetVoiceAttachmentsHTTPRequest,
  VoiceAttachment,
} from './models';
import { ApiBasePath } from '../root-api';
import { httpFilesRequestFactory } from '../common/http-file-factory';
import { UserPreview } from '../my-profile/models';
import { HttpRequestMethod } from '../common/models';

export const ChatHttpRequests = {
  getChats: httpRequestFactory<AxiosResponse<Chat[]>, GetChatsRequestData>(`${ApiBasePath.MainApi}/api/chats/search`, HttpRequestMethod.Post),
  getChatById: httpRequestFactory<AxiosResponse<Chat>, GetChatByIdRequestData>(
    ({ chatId }: GetChatByIdRequestData) => `${ApiBasePath.MainApi}/api/chats/${chatId}`,
    HttpRequestMethod.Get,
  ),
  markMessagesAsRead: httpRequestFactory<AxiosResponse, MarkMessagesAsReadRequest>(`${ApiBasePath.MainApi}/api/chats/mark-as-read`, HttpRequestMethod.Post),
  changeChatVisibilityState: httpRequestFactory<AxiosResponse, HideChatRequest>(`${ApiBasePath.MainApi}/api/chats/change-hidden-status`, HttpRequestMethod.Put),
  muteChat: httpRequestFactory<AxiosResponse, MuteChatRequest>(`${ApiBasePath.MainApi}/api/chats/change-muted-status`, HttpRequestMethod.Put),
  getChatInfo: httpRequestFactory<AxiosResponse<GetChatInfoApiResponse>, GetChatInfoRequest>(
    ({ chatId }: GetChatInfoRequest) => `${ApiBasePath.MainApi}/api/chats/${chatId}/info`,
    HttpRequestMethod.Get,
  ),
  createGroupChat: httpRequestFactory<AxiosResponse<number>, GroupChatCreationHTTPReqData>(`${ApiBasePath.MainApi}/api/group-chats`, HttpRequestMethod.Post),
  getGroupChatMembers: httpRequestFactory<AxiosResponse<Array<UserPreview>>, GetGroupChatUsersRequest>(
    `${ApiBasePath.MainApi}/api/group-chats/search-members`,
    HttpRequestMethod.Post,
  ),
  leaveGroupChat: httpRequestFactory<AxiosResponse, number>((id: number) => `${ApiBasePath.MainApi}/api/group-chats/${id}`, HttpRequestMethod.Delete),
  addMembersIntoGroupChat: httpRequestFactory<AxiosResponse, { groupChatId: number; userIds: number[] }>(
    `${ApiBasePath.MainApi}/api/group-chats/users`,
    HttpRequestMethod.Post,
  ),

  editGroupChat: httpRequestFactory<AxiosResponse, EditGroupChatHTTPReqData>(`${ApiBasePath.MainApi}/api/group-chats`, HttpRequestMethod.Put),
  // attachment lists
  getChatAudioAttachments: httpRequestFactory<AxiosResponse<Array<AudioAttachment>>, GetChatAudiosHTTPRequest>(
    `${ApiBasePath.MainApi}/api/audio-attachments/search`,
    HttpRequestMethod.Post,
  ),

  getChatVoiceAttachments: httpRequestFactory<AxiosResponse<Array<VoiceAttachment>>, GetVoiceAttachmentsHTTPRequest>(
    `${ApiBasePath.MainApi}/api/voice-attachments/search`,
    HttpRequestMethod.Post,
  ),

  getChatPictureAttachments: httpRequestFactory<AxiosResponse<Array<PictureAttachment>>, GetChatPicturesHTTPRequest>(
    `${ApiBasePath.MainApi}/api/picture-attachments/search`,
    HttpRequestMethod.Post,
  ),

  getChatRawAttachments: httpRequestFactory<AxiosResponse<Array<RawAttachment>>, GetChatFilesHTTPRequest>(
    `${ApiBasePath.MainApi}/api/raw-attachments/search`,
    HttpRequestMethod.Post,
  ),

  getChatVideoAttachments: httpRequestFactory<AxiosResponse<Array<VideoAttachment>>, GetChatVideosHTTPRequest>(
    `${ApiBasePath.MainApi}/api/video-attachments/search`,
    HttpRequestMethod.Post,
  ),
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
