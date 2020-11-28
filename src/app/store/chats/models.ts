import { Page } from '../common/models';
// eslint-disable-next-line import/no-cycle
import { Message, FileType } from '../messages/models';
import { UploadAvatarResponse, UserPreview } from '../my-profile/models';

export interface GroupChat {
  id: number;
  avatar?: {
    id: string;
    url: string;
    previewUrl: string;
  } | null;
  name: string;
  description?: string;
  membersCount: number;
  userCreatorId: number;
}

export interface ParsedInterlocutorId {
  interlocutorId: number;
  interlocutorType: InterlocutorType;
}

export enum InterlocutorType {
  USER = 1,
  GROUP_CHAT = 2,
}

export interface GetChatAudiosHTTPRequest {
  page: Page;
  chatId: number;
}

export interface GetVoiceAttachmentsHTTPRequest {
  page: Page;
  chatId: number;
}

export interface GetChatPicturesHTTPRequest {
  page: Page;
  chatId: number;
}

export interface GetChatFilesHTTPRequest {
  page: Page;
  chatId: number;
}

export interface GetChatVideosHTTPRequest {
  page: Page;
  chatId: number;
}

export interface GetGroupChatUsersRequest {
  groupChatId: number;
  page: Page;
  name?: string;
}

export interface AddUsersToGroupChatActionData {
  users: UserPreview[];
  chat: Chat;
}

export interface GetChatsRequestData {
  page: Page;
  showOnlyHidden: boolean;
  showAll: boolean;
  initializedBySearch?: boolean;
  name?: string;
}

export interface GetChatByIdRequestData {
  chatId: number;
}

export interface MarkMessagesAsReadRequest {
  chatId: number;
  lastReadMessageId: number;
}

export interface EditGroupChatHTTPReqData {
  id: number;
  name?: string;
  description?: string;
  avatarId?: string;
}

export interface EditGroupChatReqData {
  id: number;
  name: string;
  description?: string;
  avatar: {
    id: string;
    url: string;
    previewUrl: string;
  } | null;
}

export interface GetChatsActionData {
  page: Page;
  unreadOnly?: boolean;
  showOnlyHidden: boolean;
  showAll: boolean;
  initializedBySearch: boolean;
  name?: string;
}

export interface HideChatRequest {
  chatIds: (number | undefined)[];
  isHidden: boolean;
}

export interface GetChatInfoRequest {
  chatId: number;
}

export interface GetChatInfoApiResponse {
  rawAttachmentsCount: number;
  voiceAttachmentsCount: number;
  videoAttachmentsCount: number;
  audioAttachmentsCount: number;
  pictureAttachmentsCount: number;
}

export interface GetChatInfoResponse {
  chatId: number;
  rawAttachmentsCount: number;
  voiceAttachmentsCount: number;
  videoAttachmentsCount: number;
  audioAttachmentsCount: number;
  pictureAttachmentsCount: number;
}

export interface MuteChatRequest {
  chatIds: (number | undefined)[];
  isMuted: boolean;
}

export interface GetPhotoAttachmentsRequest {
  chatId: number;
  page: Page;
}

export interface GetRecordingsRequest {
  chatId: number;
  page: Page;
}

export interface GetVideoAttachmentsRequest {
  chatId: number;
  page: Page;
}

export interface GetRawAttachmentsRequest {
  chatId: number;
  page: Page;
}

export interface GetAudioAttachmentsRequest {
  chatId: number;
  page: Page;
}

export interface Chat {
  id: number;
  interlocutorType?: InterlocutorType;
  groupChat?: GroupChat;
  lastMessage?: Message;
  interlocutor?: UserPreview;
  ownUnreadMessagesCount?: number;
  interlocutorLastReadMessageId?: number;
  draftMessage: string;
  timeoutId?: NodeJS.Timeout;
  typingInterlocutors?: { timeoutId: NodeJS.Timeout; fullName: string }[];
  isDeleted?: boolean;
  isMuted?: boolean;
  photos: PhotoList;
  videos: VideoList;
  audios: AudioList;
  files: FileList;
  recordings: VoiceRecordingList;
  attachmentsToSend?: AttachmentToSend<BaseAttachment>[];
  rawAttachmentsCount?: number;
  videoAttachmentsCount?: number;
  voiceAttachmentsCount?: number;
  audioAttachmentsCount?: number;
  pictureAttachmentsCount?: number;
}

export interface AttachmentToSend<T> {
  attachment: T;
  file: File;
  fileName: string;
  progress: number;
  success?: boolean;
  failure?: boolean;
}

export interface BaseAttachment {
  byteSize: number;
  type: FileType;
  creationDateTime: Date;
  url: string;
  id: number;
}

export interface AudioAttachment extends BaseAttachment {
  title: string;
  duration: number;
}

export interface PictureAttachment extends BaseAttachment {
  previewUrl: string;
}

export interface RawAttachment extends BaseAttachment {
  title: string;
}

export interface VideoAttachment extends BaseAttachment {
  duration: number;
  firstFrameUrl: string;
  name: string;
}

export interface VoiceAttachment extends BaseAttachment {
  duration: number;
}

export interface IGroupable {
  creationDateTime: Date;
  needToShowDateSeparator?: boolean;
  needToShowMonthSeparator?: boolean;
  needToShowYearSeparator?: boolean;
}

export interface ChatList {
  chats: Array<Chat>;
  hasMore: boolean;
}

export interface PhotoList {
  photos: (PictureAttachment & IGroupable)[];
  hasMore: boolean;
}

export interface VideoList {
  videos: (VideoAttachment & IGroupable)[];
  hasMore: boolean;
}

export interface FileList {
  files: (RawAttachment & IGroupable)[];
  hasMore: boolean;
}

export interface VoiceRecordingList {
  recordings: (VoiceAttachment & IGroupable)[];
  hasMore: boolean;
}

export interface AudioList {
  audios: (AudioAttachment & IGroupable)[];
  hasMore: boolean;
}

export interface GetChatsResponse extends ChatList {
  initializedBySearch: boolean;
}

export interface GetPhotoAttachmentsResponse extends PhotoList {
  chatId: number;
}

export interface GetRawAttachmentsResponse extends FileList {
  chatId: number;
}

export interface GetVideoAttachmentsResponse extends VideoList {
  chatId: number;
}

export interface GetRecordingsResponse extends VoiceRecordingList {
  chatId: number;
}

export interface GetAudioAttachmentsResponse extends AudioList {
  chatId: number;
}

export interface GroupChatCreationReqData {
  name: string;
  description?: string;
  userIds: Array<number>;
  currentUser: UserPreview;
  avatar?: UploadAvatarResponse | null;
}

export interface GroupChatCreationHTTPReqData {
  name: string;
  description?: string;
  userIds: Array<number>;
  currentUser: UserPreview;
  avatarId?: string | null;
}
export interface UploadAttachmentReqData {
  chatId: number;
  type: FileType;
  attachmentId: number;
  file: File;
}

export interface UploadAttachmentStartedData {
  chatId: number;
  attachmentId: number;
}

export interface UploadAttachmentProgressData {
  chatId: number;
  attachmentId: number;
  progress: number;
}

export interface UploadAttachmentSagaProgressData {
  progress: number;
}

export interface UploadAttachmentFailedData {
  chatId: number;
  attachmentId: number;
}

export interface RemoveAttachmentReqData {
  chatId: number;
  attachmentId: number;
}

export interface UploadAttachmentSuccessData<T = BaseAttachment> {
  chatId: number;
  attachmentId: number;
  attachment: T;
}

export interface UploadBaseResponse {
  id: string;
  byteSize: number;
  url: string;
}

export interface UploadFileResponse extends UploadBaseResponse {
  title: string;
}

export interface UploadAudioResponse extends UploadBaseResponse {
  title: string;
  duration: number;
}

export interface UploadPictureResponse extends UploadBaseResponse {
  previewUrl: string;
}

export interface UploadVideoResponse extends UploadBaseResponse {
  previewUrl: string;
}

export interface UploadVoiceResponse extends UploadBaseResponse {
  duration: string;
}

export interface MarkMessagesAsReadReqData {
  chatId: number;
  lastReadMessageId: number;
}
