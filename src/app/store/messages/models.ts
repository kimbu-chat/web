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

export enum FileType {
	music = 'music',
	file = 'file',
	photo = 'photo',
	recording = 'recording',
}

export interface FileBase {
	fileName: string;
	byteSize: number;
	url: string;
	type: FileType;
}

export interface Message {
	id: number;
	needToShowCreator?: boolean;
	userCreator: UserPreview;
	creationDateTime?: Date;
	text: string;
	attachmentsJson?: string;
	systemMessageType?: SystemMessageType;
	state?: MessageState;
	chatId?: number;
	dateSeparator?: string;
	isSelected?: boolean;
	needToShowDateSeparator?: boolean;
	attachments?: FileBase[];
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
	chatId: number;
	text: string;
	interlocutorName: string;
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
	chatId: number;
}

export interface MessageCreationReqData {
	text?: string;
	chatId?: number;
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

export interface EditMessageReq {
	messageId: number;
	chatId: number;
}

export interface ReplyMessageReq {
	messageId: number;
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
