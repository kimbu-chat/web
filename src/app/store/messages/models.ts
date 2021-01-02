import { CallStatus } from '../calls/models';
// eslint-disable-next-line import/no-cycle
import { IBaseAttachment } from '../chats/models';
import { IPage } from '../common/models';
import { IUserPreview } from '../my-profile/models';

export interface IMessagesState {
  loading: boolean;
  messages: IMessageList[];
  selectedMessageIds: number[];
  messageToReply?: IMessage;
  messageToEdit?: IMessage;
}

export interface ICallMessage {
  userCallerId: number;
  userCalleeId: number;
  duration: number;
  status: CallStatus;
}

export interface IMessageList {
  messages: IMessage[];
  hasMoreMessages: boolean;
  chatId: number;
}

export interface ISystemMessageBase {}

export interface IGroupChatMemberRemovedSystemMessageContent extends ISystemMessageBase {
  removedUserId: number;
  removedUserName: string;
}

export interface IGroupChatNameChangedSystemMessageContent extends ISystemMessageBase {
  oldName: string;
  newName: string;
}

export interface IGroupChatMemberAddedSystemMessageContent extends ISystemMessageBase {
  addedUserId: number;
  addedUserName: string;
  groupChatName: string;
  groupChatMembersNumber: number;
  groupChatAvatarUrl: string;
}

export enum FileType {
  Audio = 'Audio',
  Raw = 'Raw',
  Picture = 'Picture',
  Voice = 'Voice',
  Video = 'Video',
}

export interface IMessage {
  id: number;
  needToShowCreator?: boolean;
  isEdited?: boolean;
  userCreator: IUserPreview;
  creationDateTime?: Date;
  text: string;
  attachmentsJson?: string;
  systemMessageType?: SystemMessageType;
  state?: MessageState;
  chatId?: number;
  dateSeparator?: string;
  isSelected?: boolean;
  needToShowDateSeparator?: boolean;
  attachments?: IBaseAttachment[];
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

export interface IMessageCreationReqData {
  text?: string;
  chatId?: number;
  attachments?: IAttachmentCreation[];
}

export interface IAttachmentCreation {
  id: number;
  type: FileType;
}

export interface IMessagesReqData {
  page: IPage;
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

export interface IEditMessageApiReq {
  text: string;
  messageId: number;
  removedAttachments?: IAttachmentCreation[];
  newAttachments?: IAttachmentCreation[];
}
export interface IDeleteMessagesApiReq {
  ids: number[];
  forEveryone: boolean;
}
