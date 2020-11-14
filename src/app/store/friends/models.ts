import { Page } from '../common/models';
import { UserPreview } from '../my-profile/models';

export enum UserStatus {
	Offline = 0,
	Away = 1,
	Online = 2,
}

export interface GetFriendsActionData {
	page: Page;
	name?: string;
	initializedBySearch?: boolean;
}

export interface GetFriendsSuccessActionData {
	users: Array<UserPreview>;
	name?: string;
	initializedBySearch?: boolean;
}

export interface GetGroupChatUsersSuccessActionData {
	users: Array<UserPreview>;
}

export interface DeleteFriendsActionData {
	userIds: number[];
}

export interface UpdateFriendListActionData {
	phoneNumbers: string[];
}
