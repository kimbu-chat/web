import { Message } from '../messages/models';
import { Page } from '../common/models';
import { UserPreview, AvatarSelectedData } from '../my-profile/models';

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
}

export interface Photo {
	id: string;
	url: string;
	creationDateTime: Date;
	alt?: string;
	needToShowSeparator?: boolean;
}

export interface Video {
	id: string;
	previewImgUrl: string;
	creationDateTime: Date;
	duration: number;
	alt?: string;
	url: string;
	needToShowSeparator?: boolean;
}

export interface AttachedFile {
	id: string;
	byteSize: number;
	creationDateTime: Date;
	title: string;
	url: string;
	needToShowSeparator?: boolean;
}

export interface ChatList {
	chats: Array<Chat>;
	hasMore: boolean;
}

export interface PhotoList {
	photos: Photo[];
	hasMore: boolean;
}

export interface VideoList {
	videos: Video[];
	hasMore: boolean;
}

export interface FileList {
	files: AttachedFile[];
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
