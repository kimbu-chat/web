import { CancelTokenSource } from 'axios';
import { IPage } from '../common/models';
// eslint-disable-next-line import/no-cycle
import { IMessage, FileType } from '../messages/models';
import { IAvatar, IUserPreview } from '../my-profile/models';

export interface IUploadingAttachment {
  id: number;
  cancelTokenSource: CancelTokenSource;
}

export interface IChatsState {
  groupChatUsersLoading?: boolean;
  loading: boolean;
  hasMore: boolean;
  searchString: string;
  chats: IChat[];
  selectedChatId: number | null;
}

export interface IGroupChat {
  id: number;
  avatar?: IAvatar | null;
  name: string;
  description?: string;
  membersCount: number;
  userCreatorId: number;
}

export enum InterlocutorType {
  User = 1,
  GroupChat = 2,
}

export interface IGetChatAudiosHTTPRequest {
  page: IPage;
  chatId: number;
}

export interface IGetVoiceAttachmentsHTTPRequest {
  page: IPage;
  chatId: number;
}

export interface IGetChatPicturesHTTPRequest {
  page: IPage;
  chatId: number;
}

export interface IGetChatFilesHTTPRequest {
  page: IPage;
  chatId: number;
}

export interface IGetChatVideosHTTPRequest {
  page: IPage;
  chatId: number;
}

export interface IGetChatsRequestData {
  page: IPage;
  showOnlyHidden: boolean;
  showAll: boolean;
  initializedBySearch?: boolean;
  name?: string;
}

export interface IGetChatByIdRequestData {
  chatId: number;
}

export interface IGetUserByIdRequestData {
  userId: number;
}

export interface IMarkMessagesAsReadRequest {
  chatId: number;
  lastReadMessageId: number;
}

export interface IEditGroupChatHTTPReqData {
  id: number;
  name?: string;
  description?: string;
  avatarId?: number;
}

export interface IHideChatRequest {
  chatIds: (number | undefined)[];
  isHidden: boolean;
}

export interface IGetChatInfoApiResponse {
  rawAttachmentsCount: number;
  voiceAttachmentsCount: number;
  videoAttachmentsCount: number;
  audioAttachmentsCount: number;
  pictureAttachmentsCount: number;
}

export interface IChangeChatMutedStatusRequest {
  chatIds: (number | undefined)[];
  isMuted: boolean;
}

export interface IChat {
  id: number;
  interlocutorType?: InterlocutorType;
  groupChat?: IGroupChat;
  lastMessage?: IMessage | null;
  interlocutor?: IUserPreview;
  unreadMessagesCount?: number;
  interlocutorLastReadMessageId?: number;
  draftMessage?: string;
  timeoutId?: NodeJS.Timeout;
  typingInterlocutors?: { timeoutId: NodeJS.Timeout; fullName: string }[];
  isMuted?: boolean;

  photos: IPhotoList;
  videos: IVideoList;
  audios: IAudioList;
  files: IFilesList;
  members: IMembersList;
  recordings: IVoiceRecordingList;

  attachmentsToSend?: IAttachmentToSend<IBaseAttachment>[];

  rawAttachmentsCount?: number;
  videoAttachmentsCount?: number;
  voiceAttachmentsCount?: number;
  audioAttachmentsCount?: number;
  pictureAttachmentsCount?: number;
}

export interface IChangeLastMessageReq {
  newMessage: IMessage;
  chatId: number;
}

export interface IAttachmentToSend<T> {
  attachment: T;
  file: File;
  fileName: string;
  progress: number;
  success?: boolean;
  failure?: boolean;
}

export interface IBaseAttachment {
  byteSize: number;
  type: FileType;
  creationDateTime: Date;
  url: string;
  id: number;
}

export interface IAudioAttachment extends IBaseAttachment {
  title: string;
  duration: number;
}

export interface IPictureAttachment extends IBaseAttachment {
  previewUrl: string;
}

export interface IRawAttachment extends IBaseAttachment {
  title: string;
}

export interface IVideoAttachment extends IBaseAttachment {
  duration: number;
  firstFrameUrl: string;
  name: string;
}

export interface IVoiceAttachment extends IBaseAttachment {
  duration: number;
}

export interface IGroupable {
  creationDateTime: Date;
  needToShowDateSeparator?: boolean;
  needToShowMonthSeparator?: boolean;
  needToShowYearSeparator?: boolean;
}

interface IMembersList {
  members: IUserPreview[];
  searchMembers: IUserPreview[];
  loading: boolean;
  hasMore: boolean;
}

export interface IChatList {
  chats: Array<IChat>;
  hasMore: boolean;
}

interface IPhotoList {
  photos: (IPictureAttachment & IGroupable)[];
  loading: boolean;
  hasMore: boolean;
}

interface IVideoList {
  videos: (IVideoAttachment & IGroupable)[];
  loading: boolean;
  hasMore: boolean;
}

interface IFilesList {
  files: (IRawAttachment & IGroupable)[];
  loading: boolean;
  hasMore: boolean;
}

interface IVoiceRecordingList {
  recordings: (IVoiceAttachment & IGroupable)[];
  loading: boolean;
  hasMore: boolean;
}

interface IAudioList {
  audios: (IAudioAttachment & IGroupable)[];
  loading: boolean;
  hasMore: boolean;
}
export interface IGroupChatCreationHTTPReqData {
  name: string;
  description?: string;
  userIds: Array<number>;
  avatarId?: number | null;
}

export interface IUploadAttachmentSagaProgressData {
  progress: number;
}

interface IUploadBaseResponse {
  id: string;
  byteSize: number;
  url: string;
}

export interface IUploadFileResponse extends IUploadBaseResponse {
  title: string;
}

export interface IUploadAudioResponse extends IUploadBaseResponse {
  title: string;
  duration: number;
}

export interface IUploadPictureResponse extends IUploadBaseResponse {
  previewUrl: string;
}

export interface IUploadVideoResponse extends IUploadBaseResponse {
  previewUrl: string;
}

export interface IUploadVoiceResponse extends IUploadBaseResponse {
  duration: string;
}
