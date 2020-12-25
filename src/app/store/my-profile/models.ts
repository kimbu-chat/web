import { UserStatus } from '../common/models';

export interface MyProfileState {
  user?: UserPreview;
}

export interface UserPreview {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: Avatar;
  nickname: string;
  status: UserStatus;
  gender?: number;
  lastOnlineTime: Date;
  phoneNumber: string;

  supposedToAddIntoGroupChat?: boolean;
}
export interface UpdateMyProfileApiRequestData {
  firstName: string;
  lastName: string;
  avatarId?: number;
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

export interface Avatar {
  url: string;
  previewUrl: string;
  id: number;
}

export interface UploadAvatarResponse {
  url: string;
  previewUrl: string;
  id: number;
}
