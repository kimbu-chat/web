import { Page, UserStatus } from '../common/models';

export interface MyProfileState {
  user?: UserPreview;
}

export interface UserPreview {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: { url: string; previewUrl: string; id: string };
  nickname: string;
  status: UserStatus;
  gender?: number;
  lastOnlineTime: Date;
  phoneNumber: string;

  supposedToAddIntoGroupChat?: boolean;
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
  hasMore: boolean;
}

export interface UpdateMyProfileActionData {
  firstName: string;
  lastName: string;
  avatar?: { url: string; previewUrl: string; id: string };
}

export interface UpdateMyProfileApiRequestData {
  firstName: string;
  lastName: string;
  avatarId?: string;
}

export interface UpdateNicknameActionData {
  nickname: string;
}

export interface CheckNicknameActionData {
  nickname: string;
}

export interface AvatarSelectedData {
  offsetY?: number;
  offsetX?: number;
  width?: number;
  imagePath: string;
  croppedImagePath: string;
}

export interface UpdateAvatarSuccess {
  fullAvatarUrl: string;
  croppedAvatarUrl: string;
}

export interface UploadAvatarResponse {
  url: string;
  previewUrl: string;
  id: string;
}

export interface UploadAvatarReqData {
  pathToFile: string;
  onProgress?: (progress: number) => void;
}

export interface UploadAvatarSagaProgressData {
  progress: number;
}
