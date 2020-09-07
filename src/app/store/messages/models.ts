import { UserPreview } from '../my-profile/models';
import { Chat } from '../chats/models';
import { Page } from '../common/models';

export interface MessageList {
	messages: Message[];
	hasMoreMessages: boolean;
	chatId: number;
}

export interface SystemMessageBase {}

export interface ConfereceMemberRemovedSystemMessageContent extends SystemMessageBase {
	removedUserId: number;
	removedUserName: string;
}

export interface ConfereceNameChangedSystemMessageContent extends SystemMessageBase {
	oldName: string;
	newName: string;
}

export interface ConfereceMemberAddedSystemMessageContent extends SystemMessageBase {
	addedUserId: number;
	addedUserName: string;
	conferenceName: string;
	conferenceMembersNumber: number;
	conferenceAvatarUrl: string;
}

export interface Content {
	type?: string;
	originalUrl?: string;
	thumbnailLargeUrl?: string;
	thumbnailMediumUrl?: string;
	thumbnailSmallUrl?: string;
	votesCount?: string;
	commentsCount?: string;
	id?: number;
	isVoted?: boolean;
	userCreator?: UserPreview;
	creationDateTime?: Date;
}

export interface Message {
	id: number;
	needToShowCreator?: boolean;
	userCreator: UserPreview | null;
	creationDateTime?: Date;
	text: string;
	attachments?: Array<Content>;
	attachmentsJson?: string;
	systemMessageType?: SystemMessageType;
	state?: MessageState;
	chatId?: number;
	dateSeparator?: string;
	isSelected?: boolean;
	needToShowDateSeparator?: boolean;
}

export enum SystemMessageType {
	None = 0,
	ConferenceMemberRemoved = 1,
	ConferenceAvatarChanged = 2,
	ConferenceCreated = 3,
	ConferenceMemberAdded = 4,
	ConferenceNameChanged = 5,
	ConferenceAvatarRemoved = 6,
	UserCreated = 7,
	MissedCall = 8,
}

export interface UserMessageTypingRequest {
	interlocutorId?: number;
	isConference?: boolean;
	text?: string;
}

export interface EntityCreation {}

export interface CreateMessageRequest extends EntityCreation {
	chat: Chat;
	currentUser: { id: number };
	selectedChatId: number;
	message: Message;
	isFromEvent?: boolean;
}

export interface CreateMessageResponse {
	oldMessageId: number;
	newMessageId: number;
	messageState: MessageState;
	chatId: number;
}

export interface MarkMessagesAsReadRequest {
	chatId: number | null;
}

export interface MessageCreationReqData {
	text?: string;
	conferenceId?: number | null;
	userInterlocutorId?: number | null;
	attachments?: Array<AttachmentCreation>;
}

export interface AttachmentCreation {
	id: number;
	type: string;
}

export interface MessagesReqData {
	page: Page;
	chatId: number;
}

export interface MessagesReq {
	page: Page;
	chat: Chat;
	initiatedByScrolling: boolean;
}

export interface DeleteMessageReq {
	messageIds: number[];
	chatId: number;
}

export interface SelectMessageReq {
	messageId: number;
	chatId: number;
}

export interface CopyMessagesReq {
	messageIds: number[];
	chatId: number;
}

export interface ResetSelectedMessagesReq {
	chatId: number;
}

export enum MessageState {
	QUEUED = 1,
	SENT = 2,
	READ = 3,
	ERROR = 4,
	DELETED = 5,
	LOCALMESSAGE = 6,
}

export interface UploadingFileInfo {
	localUri: string;
	isError: boolean;
	uploadId: string;
	progress: number;
	fileType: FileType;
}

export enum FileType {
	Photo = 1,
	Video = 2,
	Audio = 3,
	RawFile = 4,
}
