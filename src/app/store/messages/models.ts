import { UserPreview } from '../my-profile/models';
import { BaseAttachment, Chat } from '../chats/models';
import { Page } from '../common/models';

export interface MessageList {
	messages: Message[];
	hasMoreMessages: boolean;
	chatId: number;
}

export interface SystemMessageBase {}

export interface GroupChatMemberRemovedSystemMessageContent extends SystemMessageBase {
	removedUserId: number;
	removedUserName: string;
}

export interface GroupChatNameChangedSystemMessageContent extends SystemMessageBase {
	oldName: string;
	newName: string;
}

export interface GroupChatMemberAddedSystemMessageContent extends SystemMessageBase {
	addedUserId: number;
	addedUserName: string;
	groupChatName: string;
	groupChatMembersNumber: number;
	groupChatAvatarUrl: string;
}

export enum FileType {
	audio = 'Audio',
	raw = 'Raw',
	picture = 'Picture',
	voice = 'Voice',
	video = 'Video',
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
	attachments?: BaseAttachment[];
}

export enum SystemMessageType {
	None = 'None',
	GroupChatMemberRemoved = 1,
	GroupChatAvatarChanged = 2,
	GroupChatCreated = 'GroupChatCreated',
	GroupChatMemberAdded = 4,
	GroupChatNameChanged = 5,
	GroupChatAvatarRemoved = 6,
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
	attachments?: BaseAttachment[];
}

export interface CreateMessageResponse {
	oldMessageId: number;
	newMessageId: number;
	messageState: MessageState;
	chatId: number;
}

export interface MessageCreationReqData {
	text?: string;
	chatId?: number;
	attachments?: Array<AttachmentCreation>;
}

export interface AttachmentCreation {
	id: string;
	type: FileType;
}

export interface MessagesReqData {
	page: Page;
	chatId: number;
}

export interface MessagesReq {
	page: Page;
	chat: Chat;
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
