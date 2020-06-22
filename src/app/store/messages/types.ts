import { UserPreview } from '../contacts/types';
import { Page } from '../common/types';
import { Dialog } from '../dialogs/types';

export enum MessagesActionTypes {
  GET_MESSAGES = 'GET_MESSAGES',
  GET_MESSAGES_SUCCESS = 'GET_MESSAGES_SUCCESS',
  GET_MESSAGES_FAILURE = 'GET_MESSAGES_FAILURE',

  SEND_MESSAGE = 'SEND_MESSAGE',
  SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS',
  SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE',

  CREATE_MESSAGE = 'CREATE_MESSAGE',
  CREATE_MESSAGE_SUCCESS = 'CREATE_MESSAGE_SUCCESS',

  NOTIFY_USER_ABOUT_MESSAGE_TYPING = 'NOTIFY_USER_ABOUT_MESSAGE_TYPING',
  INTERLOCUTOR_MESSAGE_TYPING_EVENT = 'INTERLOCUTOR_MESSAGE_TYPING_EVENT',
  INTERLOCUTOR_STOPPED_TYPING = 'INTERLOCUTOR_STOPPED_TYPING',

  RESET_UNREAD_MESSAGES_COUNT = 'RESET_UNREAD_MESSAGES_COUNT',
  USER_MESSAGE_READ_FROM_EVENT = 'USER_MESSAGE_READ_FROM_EVENT'
}

export interface GetMessagesResponse {
  messages: Message[];
  hasMoreMessages: boolean;
  dialogId: number;
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

export interface Message {
  id?: number;
  userCreator: UserPreview;
  creationDateTime?: Date;
  text: string;
  attachmentsJson?: string;
  systemMessageType?: SystemMessageType;
  state?: MessageState;
  dialogId?: number;
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
  UserCreated = 7
}

export interface UserMessageTypingRequest {
  interlocutorId?: number;
  isConference?: boolean;
  text?: string;
}

export interface EntityCreation {}

export interface CreateMessageRequest extends EntityCreation {
  dialog: Dialog;
  currentUser: UserPreview;
  selectedDialogId: number;
  message: Message;
  files?: Array<UploadingFileInfo>;
  isFromEvent: boolean;
}

export interface CreateMessageResponse {
  oldMessageId: number;
  newMessageId: number;
  messageState: MessageState;
  dialogId: number;
}

export interface MarkMessagesAsReadRequest {
  dialog: {
    interlocutorId?: number;
    conferenceId?: number;
  };
}

export interface MessageCreationReqData {
  text?: string;
  conferenceId?: number;
  userInterlocutorId?: number;
  attachments?: Array<AttachmentCreation>;
}

export interface AttachmentCreation {
  id: number;
  type: string;
}

export interface MessagesReqData {
  page: Page;
  dialog: {
    id: number;
    type: 'User' | 'Conference';
  };
}

export interface MessagesReq {
  page: Page;
  dialog: Dialog;
  initiatedByScrolling: boolean;
}

export enum MessageState {
  QUEUED = 1,
  SENT = 2,
  READ = 3,
  ERROR = 4,
  DELETED = 5,
  LOCALMESSAGE = 6
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
  RawFile = 4
}
