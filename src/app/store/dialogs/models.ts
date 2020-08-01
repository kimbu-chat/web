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
	Conference = 'Conference',
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
