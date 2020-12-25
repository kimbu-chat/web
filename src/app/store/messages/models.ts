import { CallStatus } from '../calls/models';
// eslint-disable-next-line import/no-cycle
import { BaseAttachment } from '../chats/models';
import { Page } from '../common/models';
import { UserPreview } from '../my-profile/models';

export interface MessagesState {
  loading: boolean;
  messages: MessageList[];
  selectedMessageIds: number[];
  messageToReply?: Message;
  messageToEdit?: Message;
}

export interface CallMessage {
  userCallerId: number;
  userCalleeId: number;
  duration: number;
  status: CallStatus;
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

export interface MessageCreationReqData {
  text?: string;
  chatId?: number;
  attachments?: AttachmentCreation[];
}

export interface AttachmentCreation {
  id: number;
  type: FileType;
}

export interface SubmitEditMessageHTTPReq {
  messageId: number;
  text: string;
  removedAttachments?: AttachmentCreation[];
  newAttachments?: AttachmentCreation[];
}

export interface MessagesReqData {
  page: Page;
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
export interface DeleteMessagesApiReq {
  ids: number[];
  forEveryone: boolean;
}
