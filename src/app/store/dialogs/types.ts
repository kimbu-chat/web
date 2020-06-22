import { Page } from '../common/types';
import { UserPreview } from '../contacts/types';
import { Message } from '../messages/types';

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
  MUTE_DIALOG_SUCCESS = 'MUTE_DIALOG_SUCCESS'
}

export interface Conference {
  id?: number;
  avatarUrl: string;
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
  id?: number;
  interlocutorType?: InterlocutorType;
  conference: Conference;
  lastMessage: Message;
  interlocutor: UserPreview;
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
