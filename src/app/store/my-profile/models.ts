import { UserStatus } from '../common/models';

export interface IMyProfileState {
  user?: IUserPreview;
}

export interface IUserPreview {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: IAvatar;
  nickname: string;
  status: UserStatus;
  gender?: number;
  lastOnlineTime: Date;
  phoneNumber: string;

  supposedToAddIntoGroupChat?: boolean;
}
export interface IUpdateMyProfileApiRequestData {
  firstName: string;
  lastName: string;
  avatarId?: number;
}

export interface IAvatarSelectedData {
  offsetY?: number;
  offsetX?: number;
  width?: number;
  imagePath: string;
  croppedImagePath: string;
}

export interface IAvatar {
  url: string;
  previewUrl: string;
  id: number;
}

export interface IUploadAvatarResponse {
  url: string;
  previewUrl: string;
  id: number;
}
