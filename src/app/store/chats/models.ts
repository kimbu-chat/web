import { FileType, Message } from '../messages/models';
import { Page } from '../common/models';
import { UserPreview, AvatarSelectedData } from '../my-profile/models';
import { CancelTokenSource } from 'axios';

export interface Conference {
	id: number;
	avatarUrl?: string;
	name?: string;
	membersCount?: number;
}

export interface ParsedInterlocutorId {
	interlocutorId: number;
	interlocutorType: InterlocutorType;
}

export enum InterlocutorType {
	USER = 1,
	CONFERENCE = 2,
}

export interface RenameConferenceApiRequest {
	name: string;
	id: number;
}

export interface GetConferenceUsersRequest {
	conferenceId: number;
	initiatedByScrolling: boolean;
	page: Page;
	filters?: {
		name?: string;
		age?: {
			from?: number;
			to?: number;
		};
		friendsOnly?: boolean;
		country?: string;
		city?: string;
	};
}

export interface AddUsersToConferenceActionData {
	userIds: number[];
	chat: Chat;
}

export interface RenameConferenceActionData {
	newName: string;
	chat: Chat;
}

export interface GetChatsRequestData {
	page: Page;
	unreadOnly?: boolean;
	showOnlyHidden: boolean;
	showAll: boolean;
	initiatedByScrolling?: boolean;
	initializedBySearch?: boolean;
	name?: string;
}

export interface GetChatsActionData {
	page: Page;
	unreadOnly?: boolean;
	showOnlyHidden: boolean;
	initiatedByScrolling: boolean;
	showAll: boolean;
	initializedBySearch: boolean;
	name?: string;
}

export interface HideChatRequest {
	chatIds: (number | undefined)[];
	isHidden: boolean;
}

export interface MuteChatRequest {
	chatIds: (number | undefined)[];
	isMuted: boolean;
}

export interface GetPhotoRequest {
	chatId: number;
	page: Page;
}

export interface GetRecordingsRequest {
	chatId: number;
	page: Page;
}

export interface GetVideoRequest {
	chatId: number;
	page: Page;
}

export interface GetFilesRequest {
	chatId: number;
	page: Page;
}

export enum ChatType {
	User = 'User',
	Conference = 'Conference',
}

export interface Chat {
	id: number;
	interlocutorType?: InterlocutorType;
	conference?: Conference;
	lastMessage?: Message;
	interlocutor?: UserPreview;
	ownUnreadMessagesCount?: number;
	interlocutorLastReadMessageId?: number;
	draftMessage?: string;
	timeoutId?: NodeJS.Timeout;
	typingInterlocutors: { timeoutId: NodeJS.Timeout; fullName: string }[];
	isDeleted?: boolean;
	isMuted?: boolean;
	photos: PhotoList;
	videos: VideoList;
	files: FileList;
	recordings: VoiceRecordingList;
	attachmentsToSend?: AttachmentToSend<BaseAttachment>[];
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
	url: string;
	id: string;
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
	needToShowSeparator?: boolean;
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

export interface GetChatsResponse extends ChatList {
	initializedBySearch: boolean;
}

export interface GetPhotoResponse extends PhotoList {
	chatId: number;
}

export interface GetFilesResponse extends FileList {
	chatId: number;
}

export interface GetVideoResponse extends VideoList {
	chatId: number;
}

export interface GetRecordingsResponse extends VoiceRecordingList {
	chatId: number;
}

export interface ConferenceCreationReqData {
	name: string;
	userIds: Array<number>;
	currentUser: UserPreview;
	avatar: AvatarSelectedData | null;
	conferenceId?: number;
	avatarData?: AvatarSelectedData | null;
}

export interface ChangeConferenceAvatarActionData {
	conferenceId: number;
	avatarData: AvatarSelectedData;
}

export interface ChangeConferenceAvatarSuccessActionData {
	conferenceId: number;
	fullAvatarUrl: string;
	croppedAvatarUrl: string;
}

export interface UploadAttachmentReqData {
	chatId: number;
	type: FileType;
	attachmentId: string;
	file: File;
}

export interface UploadAttachmentStartedData {
	chatId: number;
	attachmentId: string;
	cancelTokenSource: CancelTokenSource;
}

export interface UploadAttachmentSagaStartedData {
	cancelTokenSource: CancelTokenSource;
}

export interface UploadAttachmentProgressData {
	chatId: number;
	attachmentId: string;
	progress: number;
}

export interface UploadAttachmentSagaProgressData {
	progress: number;
}

export interface UploadAttachmentFailedData {
	chatId: number;
	attachmentId: string;
}

export interface RemoveAttachmentReqData {
	chatId: number;
	attachmentId: string;
}

export interface UploadAttachmentSuccessData<T = BaseAttachment> {
	chatId: number;
	attachmentId: string;
	attachment: T;
}

//Upload files
export interface UploadFileRequest {
	file: File;
}

export interface UploadAudioRequest extends UploadFileRequest {}

export interface UploadPictureRequest extends UploadFileRequest {}

export interface UploadVoiceRequest extends UploadFileRequest {}

export interface UploadVideoRequest extends UploadFileRequest {}

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
