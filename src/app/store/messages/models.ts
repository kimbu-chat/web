// eslint-disable-next-line import/no-cycle
import { BaseAttachment, Chat } from '../chats/models';
import { Page } from '../common/models';
import { UserPreview } from '../my-profile/models';

export interface MessagesState {
  loading: boolean;
  messages: MessageList[];
  selectedMessageIds: number[];
  messageToReply?: Message;
  messageToEdit?: Message;
}

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
  isEdited?: boolean;
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
  GroupChatMemberRemoved = 'GroupChatMemberRemoved',
  GroupChatAvatarChanged = 'GroupChatAvatarChanged',
  GroupChatCreated = 'GroupChatCreated',
  GroupChatMemberAdded = 'GroupChatMemberAdded',
  GroupChatNameChanged = 'GroupChatNameChanged',
  GroupChatAvatarRemoved = 'GroupChatAvatarRemoved',
  UserCreated = 'UserCreated',
  CallEnded = 'CallEnded',
}

export interface UserMessageTypingRequest {
  chatId: number;
  text: string;
  interlocutorName: string;
}

export interface CreateMessageRequest {
  chatId: number;
  message: Message;
  isFromEvent?: boolean;
  currentUserId?: number;
}

export interface CreateMessageResponse {
  oldMessageId: number;
  newMessageId: number;
  messageState: MessageState;
  attachments?: BaseAttachment[];
  chatId: number;
}

export interface MessageCreationReqData {
  text?: string;
  chatId?: number;
  attachments?: AttachmentCreation[];
}

export interface AttachmentCreation {
  id: number;
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
  forEveryone: boolean;
}
export interface CleatChatHistoryReq {
  chatId: number;
  forEveryone: boolean;
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

export interface MessageDeletedFromEventReq {
  chatId: number;
  messageIds: number[];
}

export interface SubmitEditMessageReq {
  messageId: number;
  chatId: number;
  text: string;
  removedAttachments?: AttachmentCreation[];
  newAttachments?: BaseAttachment[];
}

export interface SubmitEditMessageHTTPReq {
  messageId: number;
  text: string;
  removedAttachments?: AttachmentCreation[];
  newAttachments?: AttachmentCreation[];
}

export interface ReplyMessageReq {
  messageId: number;
  chatId: number;
}

export interface ResetSelectedMessagesReq {
  chatId: number;
}

export enum MessageState {
  QUEUED = 'QUEUED',
  SENT = 'SENT',
  READ = 'READ',
  ERROR = 'ERROR',
  DELETED = 'DELETED',
  LOCALMESSAGE = 'LOCALMESSAGE',
}

export interface UploadingFileInfo {
  localUri: string;
  isError: boolean;
  uploadId: string;
  progress: number;
  fileType: FileType;
}

export interface EditMessageApiReq {
  text: string;
  messageId: number;
  removedAttachments?: AttachmentCreation[];
  newAttachments?: AttachmentCreation[];
}

export interface MessageEdited {
  attachments: BaseAttachment[];
  chatId: number;
  messageId: number;
  text: string;
  userEditorId: number;
}

export interface DeleteMessagesApiReq {
  ids: number[];
  forEveryone: boolean;
}
