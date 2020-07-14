import { Page } from '../common/types';
import { UserPreview } from '../contacts/types';
import { Message } from '../messages/interfaces';

export enum DialogsActionTypes {
  GET_DIALOGS = 'GET_DIALOGS',
  GET_DIALOGS_SUCCESS = 'GET_DIALOGS_SUCCESS',
  GET_DIALOGS_FAILURE = 'GET_DIALOGS_FAILURE',

  CHANGE_SELECTED_DIALOG = 'CHANGE_SELECTED_DIALOG',

  REMOVE_DIALOG = 'REMOVE_DIALOG',
  REMOVE_DIALOG_SUCCESS = 'REMOVE_DIALOG_SUCCESS',
  REMOVE_DIALOG_FAILURE = 'REMOVE_DIALOG_FAILURE',

  UNSET_SELECTED_DIALOG = 'UNSET_SELECTED_DIALOG',

  MUTE_DIALOG = 'MUTE_DIALOG',
  MUTE_DIALOG_SUCCESS = 'MUTE_DIALOG_SUCCESS',

  CREATE_CONFERENCE = 'CREATE_CONFERENCE',
  CREATE_CONFERENCE_SUCCESS = 'CREATE_CONFERENCE_SUCCESS',
  CREATE_CONFERENCE_FROM_EVENT = 'CREATE_CONFERENCE_FROM_EVENT',

  CONFERENCE_MESSAGE_READ_FROM_EVENT = 'CONFERENCE_MESSAGE_READ_FROM_EVENT',

  GET_CONFERENCE_USERS = 'GET_CONFERENCE_USERS',
  GET_CONFERENCE_USERS_SUCCESS = 'GET_CONFERENCE_USERS_SUCCESS',

  UNSET_CONFERENCE_USERS = 'UNSET_CONFERENCE_USERS',
  UNSET_SELECTED_USER_IDS_TO_ADD_INTO_CONFERENCE = 'UNSET_SELECTED_USER_IDS_TO_ADD_INTO_CONFERENCE',

  LEAVE_CONFERENCE = 'LEAVE_CONFERENCE',
  LEAVE_CONFERENCE_SUCCESS = 'LEAVE_CONFERENCE_SUCCESS',

  ADD_USERS_TO_CONFERENCE = 'ADD_USERS_TO_CONFERENCE',
  ADD_USERS_TO_CONFERENCE_SUCCESS = 'ADD_USERS_TO_CONFERENCE_SUCCESS',

  RENAME_CONFERENCE = 'RENAME_CONFERENCE',
  RENAME_CONFERENCE_SUCCESS = 'RENAME_CONFERENCE_SUCCESS',

  CHANGE_CONFERENCE_AVATAR = 'CHANGE_CONFERENCE_AVATAR',
  CHANGE_CONFERENCE_AVATAR_SUCCESS = 'CHANGE_CONFERENCE_AVATAR_SUCCESS',

  INTERLOCUTOR_STOPPED_TYPING = 'INTERLOCUTOR_STOPPED_TYPING',
  INTERLOCUTOR_MESSAGE_TYPING_EVENT = 'INTERLOCUTOR_MESSAGE_TYPING_EVENT',

  CREATE_MESSAGE = 'CREATE_MESSAGE',
  CREATE_MESSAGE_SUCCESS = 'CREATE_MESSAGE_SUCCESS',

  USER_STATUS_CHANGED_EVENT = 'USER_STATUS_CHANGED_EVENT',
  RESET_UNREAD_MESSAGES_COUNT = 'RESET_UNREAD_MESSAGES_COUNT'
}

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
  CONFERENCE = 2
}

export interface RenameConferenceApiRequest {
  name: string;
  id: number;
}

export interface GetConferenceUsersRequest {
  conferenceId: number;
  initiatedByScrolling: boolean;
  page: Page;
}

export interface AddUsersToConferenceActionData {
  userIds: number[];
  dialog: Dialog;
}

export interface RenameConferenceActionData {
  newName: string;
  dialog: Dialog;
}

export interface GetDialogsRequestData {
  page: Page;
  unreadOnly?: boolean;
  initiatedByScrolling?: boolean;
  initializedBySearch?: boolean;
  name?: string;
}

export interface GetDialogsActionData {
  page: Page;
  unreadOnly?: boolean;
  initiatedByScrolling: boolean;
  initializedBySearch: boolean;
  name?: string;
}

export interface HideDialogRequest {
  dialog: {
    interlocutorId?: number;
    conferenceId?: number;
  };
  isHidden: boolean;
}

export interface MuteDialogRequest {
  dialog: {
    interlocutorId?: number | null;
    conferenceId?: number | null;
  };
  isMuted: boolean;
}

export enum DialogType {
  User = 'User',
  Conference = 'Conference'
}

export interface Dialog {
  id: number;
  interlocutorType?: InterlocutorType;
  conference?: Conference | null;
  lastMessage: Message;
  interlocutor?: UserPreview | null;
  ownUnreadMessagesCount?: number;
  interlocutorLastReadMessageId?: number;
  draftMessage?: string;
  timeoutId?: any;
  isInterlocutorTyping?: boolean;
  isDeleted?: boolean;
  isMuted?: boolean;
}

export interface DialogList {
  dialogs: Array<Dialog>;
  hasMore: boolean;
}

export interface GetDialogsResponse extends DialogList {
  initializedBySearch: boolean;
}

export interface ConferenceCreationReqData {
  name: string;
  userIds: Array<number>;
  currentUser: UserPreview | null;
  // avatar?: Image;
}
