import { UserStatus } from '../friends/models';
import { Page } from '../common/models';

export interface UserPreview {
	id: number;
	firstName: string;
	lastName: string;
	avatarUrl?: string;
	nickname: string;
	status: UserStatus;
	gender?: number;
	lastOnlineTime: Date;
	phoneNumber: string;

	supposedToAddIntoConference?: boolean;
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

export interface UpdateMyProfileActionData {
	firstName: string;
	lastName: string;
}

export interface UpdateNicknameActionData {
	nickname: string;
}

export interface CheckNicknameActionData {
	nickname: string;
}

export interface AvatarSelectedData {
	offsetY: number;
	offsetX: number;
	width: number;
	imagePath: string;
	croppedImagePath: string;
}

export interface UpdateAvatarSuccess {
	fullAvatarUrl: string;
	croppedAvatarUrl: string;
}
