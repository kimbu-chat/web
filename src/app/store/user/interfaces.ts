import { Page } from '../utils';

export enum UserStatus {
  Offline = 0,
  Away = 1,
  Online = 2
}

export interface UserPreview {
  id?: number;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  nickname?: string;
  status?: UserStatus;
  gender?: number;
  lastOnlineTime?: Date;
  phoneNumber?: string;

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
  nickName: string;
}

export interface AvatarSelectedData {
  offsetY: number;
  offsetX: number;
  width: number;
  imagePath: string;
  croppedImagePath: string;
}

export interface UpdateAvatarResponse {
  fullAvatarUrl: string;
  croppedAvatarUrl: string;
}
